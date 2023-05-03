from database_operations import save_sensor_values_to_database, get_sensor_data_averages, clear_sensor_data
from bleak import BleakError
import asyncio
import json


import common

async def read_sensorvalues(client, sensorstation_id):
    try:
        temperature = int.from_bytes(await client.read_gatt_char(common.temperature_uuid), "little", signed=False)
        humidity = int.from_bytes(await client.read_gatt_char(common.humidity_uuid), "little", signed=False)
        air_pressure = int.from_bytes(await client.read_gatt_char(common.air_pressure_uuid), "little", signed=False)
        illuminance = int.from_bytes(await client.read_gatt_char(common.illuminance_uuid), "little", signed=False)
        air_quality_index = int.from_bytes(await client.read_gatt_char(common.air_quality_index_uuid), "little", signed=False)
        soil_moisture = int.from_bytes(await client.read_gatt_char(common.soil_moisture_uuid), "little", signed=False)        
        await save_sensor_values_to_database(sensorstation_id, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture)
        await asyncio.sleep(30)
    except BleakError:
        pass #TODO: logging


async def send_sensorvalues_to_backend(sensorstation_id, session, transmission_interval):
    await asyncio.sleep(transmission_interval)

    averages_dict = await get_sensor_data_averages(sensorstation_id)
    averages_json = json.dumps(averages_dict)
    async with session.post(common.web_server_address + "/access-points/" + common.access_point_name + "/sensor-stations/" + sensorstation_id, json=averages_json) as response:
        if response.status == 200:
            await clear_sensor_data(sensorstation_id)
            #TODO:Log this communication
        else:
            pass
            #TODO: Log this and error handle


