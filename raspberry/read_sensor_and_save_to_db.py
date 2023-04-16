import asyncio
import time
import sys
from bleak import BleakClient

import common
from db import db_conn

async def read_and_send_sensorvalues(sensorstation):
    try:
        async with BleakClient(sensorstation.address) as client:
            while True:
                try:
                    temperature = int.from_bytes(await client.read_gatt_char(common.temperature_uuid), "little", signed=False)
                    humidity = int.from_bytes(await client.read_gatt_char(common.humidity_uuid), "little", signed=False)
                    air_pressure = int.from_bytes(await client.read_gatt_char(common.air_pressure_uuid), "little", signed=False)
                    illuminance = int.from_bytes(await client.read_gatt_char(common.illuminance_uuid), "little", signed=False)
                    air_quality_index = int.from_bytes(await client.read_gatt_char(common.air_quality_index_uuid), "little", signed=False)
                    soil_moisture = int.from_bytes(await client.read_gatt_char(common.soil_moisture_uuid), "little", signed=False)
                except:
                    print("Error while reading BLE data, connection lost?", file=sys.stderr)
                    return

                try:
                    db_conn.execute("INSERT INTO sensordata (sensorstation_name, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                                    (sensorstation.name, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture, int(time.time())))
                    db_conn.commit()
                except:
                    print("Error adding data to database", file=sys.stderr)

                print("Wrote data to db") # TODO: temporary, remove
                await asyncio.sleep(common.polling_interval)

    except:
        # send error code to backend that connection was not succesfull and delete task? what happens at startup?
        pass
