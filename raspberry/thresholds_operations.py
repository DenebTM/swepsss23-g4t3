import common
from database_operations import get_sensor_data_thresholds, get_sensor_data_averages
from rest_operations import send_warning_to_backend, clear_warning_on_backend
import asyncio

async def check_values_for_thresholds(sensorstation_client, sensorstation_id, session):
    try:
        thresholds_dict = await get_sensor_data_thresholds(sensorstation_id)
        averages_dict = await get_sensor_data_averages(sensorstation_id)

        if thresholds_dict is None or averages_dict is None:
            raise ValueError("Received None value for thresholds or averages.")

        for sensor, average_value in averages_dict.items():
            max_threshold = thresholds_dict.get(sensor+'_max')
            min_threshold = thresholds_dict.get(sensor+'_min')

            if max_threshold is None or min_threshold is None:
                raise ValueError(f"Thresholds not found for sensor {sensor}.")

            if not min_threshold <= average_value <= max_threshold:
                await send_warning_to_sensorstation(sensorstation_client, sensorstation_id, sensor, session)
                await send_warning_to_backend(sensorstation_id, session)
    except Exception as e:
        print(e)
        # TODO log error code
                        
async def send_warning_to_sensorstation(sensorstation_client, sensorstation_id, sensor, session):
    errorCode = 1
    errorCodeByteArray = errorCode.to_bytes(1, byteorder='little')
    try:
        sensor_uuid = common.failure_uuids[sensor]
        await sensorstation_client.write_gatt_char(sensor_uuid, errorCodeByteArray)
        await sensorstation_client.start_notify(
            common.warning_active_uuid,
            lambda char, data: asyncio.create_task(
                clear_warning_on_backend(sensorstation_id, session, data)
            )
        )
    except:
        print('couldnt write to gatt')
        #TODO log error code       
