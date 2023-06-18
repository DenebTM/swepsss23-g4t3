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

            should_warn = False
            if min_threshold is not None and average_value < min_threshold:
                should_warn = True
            if max_threshold is not None and average_value > max_threshold:
                should_warn = True

            if should_warn:
                await send_warning_to_sensorstation(sensorstation_client, sensorstation_id, sensor, session)
                await send_warning_to_backend(sensorstation_id, session)
    except Exception as e:
        await logging_operations.log_local_and_remote('WARN', f'Error in threshold check for station {sensorstation_id}: {e}', entity_type='SENSOR_STATION', entity_id=str(sensorstation_id))
        
                        
async def send_warning_to_sensorstation(sensorstation_client, sensorstation_id, sensor, session):
    errorCode = 1
    errorCodeByteArray = errorCode.to_bytes(1, byteorder='little')
    try:
        sensor_uuid = common.failure_uuids[sensor]
        await sensorstation_client.write_gatt_char(sensor_uuid, errorCodeByteArray)
        await logging_operations.log_local_and_remote('INFO', f'Activated error signal on sensorstation: {sensorstation_id}, for sensor {sensor}', entity_type='SENSOR_STATION', entity_id=str(sensorstation_id))
        await sensorstation_client.start_notify(
            common.warning_active_uuid,
            lambda char, data: asyncio.create_task(
                clear_warning_on_backend(sensorstation_id, session, data)
            )
        )
    except BleakError as e:
        await logging_operations.log_local_and_remote('ERROR', f'Could not write to gatt characteristic for sensorstation {sensorstation_id}. Error: {e}', entity_type='SENSOR_STATION', entity_id=str(sensorstation_id))
           
