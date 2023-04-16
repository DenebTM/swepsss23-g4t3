import asyncio
import yaml
import aiohttp
import requests
import json
import time
from bleak import BleakScanner, BleakClient
from bleak.exc import BleakError
import sqlite3

from common import polling_interval
from search_for_sensorstations import search_for_sensorstations

sensor_station_name = "PH SensorStation"

#global constants taken out of the BLE Communication Spec
base_uuid = "0000{}-0000-1000-8000-00805f9b34fb"
temperature_uuid = base_uuid.format("2a6e")
humidity_uuid = base_uuid.format("2a6f")
air_pressure_uuid = base_uuid.format("2a6d")
illuminance_uuid = base_uuid.format("2afb")
air_quality_index_uuid = base_uuid.format("f105")
soil_moisture_uuid = base_uuid.format("f106")

sensorstations_db_conn = sqlite3.connect('sensorstations.db')

sensorstations_db_conn.execute('''CREATE TABLE IF NOT EXISTS sensordata
             (sensorstation_name TEXT,
              temperature REAL,
              humidity REAL,
              air_pressure REAL,
              illuminance REAL,
              air_quality_index REAL,
              soil_moisture REAL,
              timestamp INTEGER)''')

async def read_and_send_sensorvalues(sensorstation):
    try:
        async with BleakClient(sensorstation.address) as client:
            while True:
                temperature = int.from_bytes(await client.read_gatt_char(humidity_uuid), "little", signed=False)
                humidity = int.from_bytes(await client.read_gatt_char(temperature_uuid), "little", signed=False)
                air_pressure = int.from_bytes(await client.read_gatt_char(air_pressure_uuid), "little", signed=False)
                illuminance = int.from_bytes(await client.read_gatt_char(illuminance_uuid), "little", signed=False)
                air_quality_index = int.from_bytes(await client.read_gatt_char(air_quality_index_uuid), "little", signed=False)
                soil_moisture = int.from_bytes(await client.read_gatt_char(soil_moisture_uuid), "little", signed=False)

                sensorstations_db_conn.execute("INSERT INTO sensordata (sensorstation_name, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (sensorstation.name, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture, int(time.time())))
                sensorstations_db_conn.commit()
                await asyncio.sleep(polling_interval)

    except:
        #send error code to backend that connection was not succesfull and delete task? what happens at startup?
        pass

polling_loop = asyncio.new_event_loop()
asyncio.set_event_loop(polling_loop)
polling_loop.create_task(search_for_sensorstations())
polling_loop.run_forever()
