import asyncio
import yaml
import aiohttp
import requests
import json
import time
from bleak import BleakScanner, BleakClient
from bleak.exc import BleakError
import sqlite3
import logging

sensor_station_name = "PH SensorStation"

#global constants taken out of the BLE Communication Spec
base_uuid = "0000{}-0000-1000-8000-00805f9b34fb"
temperature_uuid = base_uuid.format("2a6e")
humidity_uuid = base_uuid.format("2a6f")
air_pressure_uuid = base_uuid.format("2a6d")
illuminance_uuid = base_uuid.format("ff04")
air_quality_index_uuid = base_uuid.format("ff05")
soil_moisture_uuid = base_uuid.format("ff06")

#in seconds
polling_interval = 10

#Values taken from config.yaml file 
with open("conf.example.yaml", "r") as f:
    config = yaml.safe_load(f)
    web_server_address = config["web_server_address"]
    web_server_address = "http://" + web_server_address + "/accesspoints/"
    access_point_name = config["access_point_name"]
    access_point_address = web_server_address + access_point_name

logging_file = "communication.log"

#triple quotation mark for multi line strings in python
sensorstations_db_conn = sqlite3.connect('sensorstations.db')
sensorstations_db_conn.execute('''CREATE TABLE IF NOT EXISTS sensorstations
             (id INTEGER PRIMARY KEY UNIQUE,
              sensorstationname TEXT,
              transmissioninterval INTEGER,
              temperature_max REAL,
              humidity_max REAL,
              air_pressure_max REAL,
              illuminance_max REAL,
              air_quality_index_max REAL,
              soil_moisture_max REAL,
              temperature_min REAL,
              humidity_min REAL,
              air_pressure_min REAL,
              illuminance_min REAL,
              air_quality_index_min REAL,
              soil_moisture_min REAL)''')

sensorstations_db_conn.execute('''CREATE TABLE IF NOT EXISTS sensordata
             (sensorstationname TEXT,
              temperature REAL,
              humidity REAL,
              air_pressure REAL,
              illuminance REAL,
              air_quality_index REAL,
              soil_moisture REAL
              timestamp INTEGER)''')


async def send_connection_request(session):
    pass


async def listen_for_instructions(session):
    async with aiohttp.ClientSession(web_server_address + "/access_points/name") as session:
        connection_allowed = await send_connection_request(session)
        while connection_allowed:

        
            


async def search_for_sensorstations():
    try:
        sensorstations = []
        devices = await BleakScanner.discover()
        for d in devices:
            if sensor_station_name in d.name:
                sensorstations.append(d)

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
    try:
        async with BleakClient(sensorstation.address) as client:#
            #send confirm to backend that connection to sensorstation
            while True:
                air_pressure = int.from_bytes(await client.read_gatt_char(air_pressure_uuid), "little", signed=False)/1000
                sensordataCursor.execute("INSERT INTO sensordata (sensors_station_name, air_pressure, datetime) VALUES (?, ?, ?)", (sensorstation.name, air_pressure, int(time.time())))
                sensordataDB.commit()
                print(air_pressure)
                print(sensorstation.name)
                await asyncio.sleep(polling_interval)
                #poll for new updates to the specific sensorstation via 

    except:
        #send error code to backend that connection was not succesfull and delete task? what happens at startup?
        pass

async def spawn_sensorstation_tasks(sensorstations):
    for sensorstation in sensorstations:
        asyncio.create_task(read_and_send_sensorvalues(sensorstation["name"]))
    

async def update_sensorstations(json_data):
    data = json.loads(json_data)
    sensorstations = data["sensorstations"]

    for sensor in sensorstations:
        sensorstationname = sensor["name"]
        transmisstioninterval = sensor["transmissioninterval"]
        temperature_max = sensor["thresholds"]["temperature_max"]
        humidity_max = sensor["thresholds"]["humidity_max"]
        air_pressure_max = sensor["thresholds"]["air_pressure_max"]
        illuminance_max = sensor["thresholds"]["illuminance_max"]
        air_quality_index_max = sensor["thresholds"]["air_quality_index_max"]
        soil_moisture_max = sensor["thresholds"]["soil_moisture_max"]
        temperature_min = sensor["thresholds"]["temperature_min"]
        humidity_min = sensor["thresholds"]["humidity_min"]
        air_pressure_min = sensor["thresholds"]["air_pressure_min"]
        illuminance_min = sensor["thresholds"]["illuminance_min"]
        air_quality_index_min = sensor["thresholds"]["air_quality_index_min"]
        soil_moisture_min = sensor["thresholds"]["soil_moisture_min"]

        sensorstations_db_conn.execute('''INSERT INTO sensorstations
                (sensorstationname, transmissioninterval,
                temperature_max, humidity_max, air_pressure_max, illuminance_max,
                air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, illuminance_min,
                air_quality_index_min, soil_moisture_min)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (sensorstationname, transmisstioninterval,
                temperature_max, humidity_max, air_pressure_max, illuminance_max,
                air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, illuminance_min,
                air_quality_index_min, soil_moisture_min))


async def check_values_for_threshholds():
    pass
        
        
async def main():
    #send to /accesspoints that i exist POST
    access_point = {'name': access_point_name}
    response = requests.post(web_server_address, json = access_point)
    #response is id:(id), active:(True oder False), name:(mei name)
    if response == 200:
        polling_loop = asyncio.new_event_loop()
        polling_loop.create_tast(listen_for_instructions)
        polling_loop.run_forever()




asyncio.run(main())
