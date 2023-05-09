import common
from database_operations import get_sensor_data_thresholds, get_sensor_data_averages, update_sensorstation
import asyncio

async def check_values_for_thresholds(sensorstation_client, sensorstation_id, session):
    try:
        thresholds_dict = await get_sensor_data_thresholds(sensorstation_id)
        averages_dict = await get_sensor_data_averages(sensorstation_id)
        for sensor, average_value in averages_dict.items():
            max_threshold = thresholds_dict[sensor+'_max']
            min_threshold = thresholds_dict[sensor+'_min']
            if not min_threshold <= average_value <= max_threshold:
                await send_warning_to_sensorstation(sensorstation_client, sensorstation_id, sensor, session)
                await send_warning_to_backend(sensorstation_id, session)
    except Exception as e:
        print(e)
        #TODO log error code

                        
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


async def send_warning_to_backend(sensorstation_id, session):
    data = {'id': sensorstation_id, 'status': 'WARNING'}
    async with session.put(common.web_server_address + '/sensor-stations/' + str(sensorstation_id), json=data) as response:
        print(response.status)
    #TODO: Log communication

async def clear_warning_on_backend(sensorstation_id, session, data):
    if int.from_bytes(data, 'little', signed=False) == 0:
        data = {'id': sensorstation_id, 'status': 'OK'}
        async with session.put(common.web_server_address + '/sensor-stations/' + str(sensorstation_id), json=data) as response:
            print(response.status)
        #TODO: Log communication

async def get_thresholds_update_db(sensorstation_id, session):
    async with session.get(common.web_server_address + '/sensor-stations/' + str(sensorstation_id)) as response:
        json_data = await response.json()
        if json_data.loads():
            await update_sensorstation(json_data)
        else:
            pass
        #TODO: implement try catch. also implement disconnection from sensorstation if not allowed
        #TODO: skip it if webserver is offline as we wont get a functioning response        
