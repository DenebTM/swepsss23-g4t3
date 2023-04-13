import asyncio
import yaml
from bleak import BleakScanner, BleakClient
from bleak.exc import BleakError
import sqlite3
import time

with open("./conf.example.yaml", "r") as f:
    config = yaml.safe_load(f)
    web_server_address = config["web_server_address"]
    access_point_name = config["access_point_name"]
    print(web_server_address)

sensor_station_name = "PH SensorStation" 
base_uuid = "0000{}-0000-1000-8000-00805f9b34fb"
temperature_uuid = base_uuid.format("2a6e")
humidity_uuid = base_uuid.format("2a6f")
air_pressure_uuid = base_uuid.format("2a6d")

sensordataDB = sqlite3.connect('sensordata.db')
sensordataCursor= sensordataDB.cursor()


async def run():
    global temperature_uuid
    global humidity_uuid
    global air_pressure
    try:
        device = None
        while device is None:
            devices = await BleakScanner.discover()
            for d in devices:
                if sensor_station_name in d.name:
                    device = d
                    break
            await asyncio.sleep(5)
        
            async with BleakClient(device.address) as client:
                while True:
                    air_pressure = int.from_bytes(await client.read_gatt_char(air_pressure_uuid), "little", signed=False)/1000
                    sensordataCursor.execute("INSERT INTO sensordata (sensors_station_name, air_pressure, datetime) VALUES (?, ?, ?)", (device.name, air_pressure, int(time.time())))
                    sensordataDB.commit()
                    print(air_pressure)
                    print(device.name)
                    await asyncio.sleep(10)
        else:
            print("No device found with name", sensor_station_name)
    except BleakError as e:
        print(f"Error: {e}")

asyncio.run(run())