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

#global constants for the error messages takne out of the ble communication Spec
error_service_uuid = base_uuid.format("ff00")
air_pressure_failure_uuid = base_uuid.format("ff01")
temperature_failure_uuid = base_uuid.format("ff02")
humidity_failure_uuid = base_uuid.format("ff03")
illuminance_failure_uuid = base_uuid.format("ff04")
air_quality_failure_uuid = base_uuid.format("ff05")
soil_moisture_failure_uuid = base_uuid.format("ff06")

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
            pass

        
            


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

async def spawn_sensorstation_tasks(sensorstations):
    for sensorstation in sensorstations:
        asyncio.create_task(read_and_send_sensorvalues(sensorstation["name"]))
    

async def update_sensorstations(json_data):
    data = json.loads(json_data)
    sensorstation = data["sensorstation"]

    with sensorstations_db_conn:
        try:
            sensorstationname = sensorstation["name"]
            transmisstioninterval = sensorstation["transmissioninterval"]
            thresholds = sensorstation["thresholds"]
            temperature_max = thresholds["temperature_max"]
            humidity_max = thresholds["humidity_max"]
            air_pressure_max = thresholds["air_pressure_max"]
            illuminance_max = thresholds["illuminance_max"]
            air_quality_index_max = thresholds["air_quality_index_max"]
            soil_moisture_max = thresholds["soil_moisture_max"]
            temperature_min = thresholds["temperature_min"]
            humidity_min = thresholds["humidity_min"]
            air_pressure_min = thresholds["air_pressure_min"]
            illuminance_min = thresholds["illuminance_min"]
            air_quality_index_min = thresholds["air_quality_index_min"]
            soil_moisture_min = thresholds["soil_moisture_min"]

            sensorstations_db_conn.execute(
                '''INSERT INTO sensorstations
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
        except Exception as e:
            sensorstations_db_conn.rollback()
            print(f"Error inserting data for sensorstation {sensorstationname}: {e}")




async def check_values_for_threshholds(sensorstation):
    current_time = int (time.time())
    five_min_ago = current_time - 300

    with sensorstations_db_conn:
        try:
            averages_query = sensorstations_db_conn.execute(
            f'''SELECT AVG(temperature) AS temp_avg, AVG(humidity) AS humidity_avg,
            AVG(air_pressure) AS air_pressure_avg, AVG(illuminance) AS illuminance_avg,
            AVG(air_quality_index) AS air_quality_index_avg, AVG(soil_moisture) AS soil_moisture_avg
            FROM sensordata
            WHERE sensorstationname = ?
            AND timestamp >= ?''',
            (sensorstation.name, five_min_ago)
            )

            averages_dict = dict(averages_query.fetchone())


            thresholds_query = sensorstations_db_conn.execute(
            f'''SELECT temperature_max, humidity_max, air_pressure_max, 
                illuminance_max, air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, 
                illuminance_min, air_quality_index_min, soil_moisture_min
                FROM sensorstations
                WHERE sensorstationname = ?''',
            (sensorstation.name,)
            )
            thresholds_dict = dict(thresholds_query.fetchone())

            # Check if averages are outside thresholds and take appropriate action
            for metric, average_value in averages_dict.items():
                if metric in thresholds_dict:
                    max_threshold = thresholds_dict[metric+"_max"]
                    min_threshold = thresholds_dict[metric+"_min"]
                    if max_threshold is not None and average_value > max_threshold or average_value < min_threshold:
                        pass
                        #return function with name of sensor who is out of bounds to send to sensorstation and backend
                        #send errorcode to backend and let light of sensorstation glow
        except:
            pass

async def send_error(sensorstation, sensor):
    service = await sensorstation.get_service(error_service_uuid)
    characteristic = await service.get_characteristic(characteristic_uuid)

    # Convert the value to bytes and write it to the characteristic
    value_bytes = bytes(value)
    await characteristic.write_value(value_bytes)
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
