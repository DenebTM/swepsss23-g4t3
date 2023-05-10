import database_operations
from bleak import BleakError
import asyncio
import json
import time


import common

READ_SENSOR_INTERVAL = 5

async def read_sensorvalues(client, sensorstation_id, connection_request):
    while not connection_request.done() and client.is_connected:
        try:
            temperature = int.from_bytes(await client.read_gatt_char(common.temperature_uuid), 'little', signed=False)
            humidity = int.from_bytes(await client.read_gatt_char(common.humidity_uuid), 'little', signed=False)
            air_pressure = int.from_bytes(await client.read_gatt_char(common.air_pressure_uuid), 'little', signed=False)
            illuminance = int.from_bytes(await client.read_gatt_char(common.illuminance_uuid), 'little', signed=False)
            air_quality_index = int.from_bytes(await client.read_gatt_char(common.air_quality_index_uuid), 'little', signed=False)
            soil_moisture = int.from_bytes(await client.read_gatt_char(common.soil_moisture_uuid), 'little', signed=False)        
            await database_operations.save_sensor_values_to_database(sensorstation_id, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture)
            await asyncio.sleep(READ_SENSOR_INTERVAL)
        except BleakError:
            pass #TODO: logging


async def send_sensorvalues_to_backend(sensorstation_id, session):
    averages_dict = await database_operations.get_sensor_data_averages(sensorstation_id)
    averages_dict['timestamp'] = int(time.time())
    averages_json = json.dumps(averages_dict)
    async with session.post('/sensor-station/' + str(sensorstation_id) + '/measurements', json=averages_json) as response:
        if response.status == 200:
            print(response.status)
            await database_operations.clear_sensor_data(sensorstation_id)
            #TODO:Log this communication
        else:
            pass
            #TODO: Log this and error handle
