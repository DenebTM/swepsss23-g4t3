import asyncio
import yaml
import aiohttp
import requests
import json
from bleak import BleakScanner, BleakClient
from bleak.exc import BleakError
import sqlite3

sensor_station_name = "PH SensorStation" 
base_uuid = "0000{}-0000-1000-8000-00805f9b34fb"
temperature_uuid = base_uuid.format("2a6e")
humidity_uuid = base_uuid.format("2a6f")
air_pressure_uuid = base_uuid.format("2a6d")


with open("conf.example.yaml", "r") as f:
    config = yaml.safe_load(f)
    web_server_address = config["web_server_address"]
    web_server_address = "http://" + web_server_address
    access_point_name = config["access_point_name"]
    access_point_address = web_server_address + "/" + access_point_name



sensordataDB = sqlite3.connect("sensordata.db")
sensordataCursor= sensordataDB.cursor()




async def send_request(session):
    async with session.get("") as response:
        data = await response.json()
        return data.get("connection_allowed")


async def listen_for_instructions(session):
    while True:
        connection_allowed = await send_request(session)

        if not connection_allowed:
            break
        async with aiohttp.CLientsession(access_point_address) as subsession:
            pass
            


async def search_for_sensorstations():
    try:
        sensorstations = []
        devices = await BleakScanner.discover()
        for d in devices:
            if sensor_station_name in d.name:
                sensorstations.append(d)
        sensor = {
            "name": d.name,
            "mac_address": d.address,
            "uuid": str(d.uuid)
        }
        sensorstations.append(sensor)

        
        
        
        data = {
            "sensorstations": sensorstations
        }
        
        response = requests.post(access_point_address + "/sensorstations", json=data)
        
        if response.status_code == 200:
            #write to audit log
            pass
        else:
            #write error to audit log
            pass
        

    except BleakError as e:
        #write error to audit log
        print(f"Error: {e}")


async def read_and_send_sensorvalues(sensorstation):
    pass

async def connection_to_sensorstation(sensorstation, interval):
    pass


async def update_sensorstations(json_data):
    data = json.loads(json_data)
    sensorstations = data["sensorstations"]

    for sensor in sensorstations:
        sensorstationname = sensor["name"]
        transmisstioninterval = sensor["transmissioninterval"]
        humidity_max = sensor["thresholds"]["humidity_max"]
        humidity_min = sensor["thresholds"]["humidity_max"]

    pass

async def check_values_for_threshholds():
    pass
        
        
async def main():
    async with aiohttp.ClientSession(web_server_address + "/access_points") as session:
        while True:
            connection_allowed = await send_request(session)
            if connection_allowed:
                await listen_for_instructions(session)
            else:
                while not connection_allowed:
                    await asyncio.sleep(5)
                    connection_allowed = await send_request(session)


asyncio.run(main())
