import asyncio
import requests
from bleak import BleakScanner
from bleak.exc import BleakError

import common

async def search_for_sensorstations():
    try:
        sensorstations = []
        devices = await BleakScanner.discover()
        for d in devices:
            if common.sensor_station_name in d.name:
                sensorstations.append(d)

        data = {
            "sensorstations": sensorstations
        }

        response = requests.post(common.access_point_address + "/sensorstations", json=data)

        if response.status_code == 200:
            # write to audit log
            pass
        else:
            # write error to audit log
            pass
    except BleakError as e:
        # write error to audit log
        print(f"Error: {e}")

asyncio.run(search_for_sensorstations())
