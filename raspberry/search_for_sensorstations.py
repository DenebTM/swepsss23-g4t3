import asyncio
import yaml
import aiohttp
import requests
import json
import time
from bleak import BleakScanner, BleakClient
from bleak.exc import BleakError
import sqlite3

sensor_station_name = "PH SensorStation"

#global constants taken out of the BLE Communication Spec
base_uuid = "0000{}-0000-1000-8000-00805f9b34fb"
temperature_uuid = base_uuid.format("2a6e")
humidity_uuid = base_uuid.format("2a6f")
air_pressure_uuid = base_uuid.format("2a6d")
illuminance_uuid = base_uuid.format("ff04")
air_quality_index_uuid = base_uuid.format("ff05")
soil_moisture_uuid = base_uuid.format("ff06")

async def search_for_sensorstations():
    try:
        sensorstations = []
        devices = await BleakScanner.discover()
        for d in devices:
            if sensor_station_name in d.name:
                sensorstations.append(d)
    except BleakError as e:
        #write error to audit log
        print(f"Error: {e}")

asyncio.run(search_for_sensorstations())