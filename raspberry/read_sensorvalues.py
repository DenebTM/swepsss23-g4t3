from database_operations import save_sensor_values_to_database
from bleak import BleakClient, BleakError
import asyncio

from db import db_conn

import common

async def read_sensorvalues(sensorstation):
    try:
        print("did i get here?")
        async with BleakClient(sensorstation.address) as client:
            temperature = int.from_bytes(await client.read_gatt_char(common.temperature_uuid), "little", signed=False)
            humidity = int.from_bytes(await client.read_gatt_char(common.humidity_uuid), "little", signed=False)
            air_pressure = int.from_bytes(await client.read_gatt_char(common.air_pressure_uuid), "little", signed=False)
            illuminance = int.from_bytes(await client.read_gatt_char(common.illuminance_uuid), "little", signed=False)
            air_quality_index = int.from_bytes(await client.read_gatt_char(common.air_quality_index_uuid), "little", signed=False)
            soil_moisture = int.from_bytes(await client.read_gatt_char(common.soil_moisture_uuid), "little", signed=False)
            
            await save_sensor_values_to_database(sensorstation.name, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture)
        await asyncio.sleep(30)
    except BleakError:
        pass #TODO 
