import common
from bleak import BleakError
from database_operations import get_sensorstation_thresholds, get_sensor_data_averages
from rest_operations import send_warning_to_backend, clear_warning_on_backend
import asyncio
import logging_operations

async def check_values_for_thresholds(sensorstation_client, sensorstation_id, session):
    try:
        thresholds_dict = await get_sensorstation_thresholds(sensorstation_id)
        averages_dict = await get_sensor_data_averages(sensorstation_id)

        if thresholds_dict is None or averages_dict is None:
            raise ValueError('Received None value for thresholds or averages.')

        for sensor, average_value in averages_dict.items():
            max_threshold = thresholds_dict.get(sensor+'_max')
            min_threshold = thresholds_dict.get(sensor+'_min')

            if max_threshold is None or min_threshold is None:
                raise ValueError(f'Thresholds not found for sensor {sensor}.')

            if not min_threshold <= average_value <= max_threshold:
                await send_warning_to_sensorstation(sensorstation_client, sensorstation_id, sensor, session)
                await send_warning_to_backend(sensorstation_id, session)
    except Exception as e:
        await logging_operations.log_to_file_and_list('WARN', f'Error in threshold check: {sensorstation_id}', entity_type='SENSOR_STATION', entity_id=str(sensorstation_id))
        
                        
async def send_warning_to_sensorstation(sensorstation_client, sensorstation_id, sensor, session):
    errorCode = 1
    errorCodeByteArray = errorCode.to_bytes(1, byteorder='little')
    try:
        sensor_uuid = common.failure_uuids[sensor]
        await sensorstation_client.write_gatt_char(sensor_uuid, errorCodeByteArray)
        await logging_operations.log_to_file_and_list('INFO', f'Activated error signal on sensorstation: {sensorstation_id}, for sensor {sensor}', entity_type='SENSOR_STATION', entity_id=str(sensorstation_id))
        await sensorstation_client.start_notify(
            common.warning_active_uuid,
            lambda char, data: asyncio.create_task(
                clear_warning_on_backend(sensorstation_id, session, data)
            )
        )
    except BleakError as e:
        await logging_operations.log_to_file_and_list('ERROR', f'Couldnt write to gatt characteristic for sensorstation {sensorstation_id}. Error: {e}', entity_type='SENSOR_STATION', entity_id=str(sensorstation_id))
           
