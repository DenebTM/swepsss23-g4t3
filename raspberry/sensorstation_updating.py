import asyncio
import yaml
import aiohttp
import requests
import json
import time
from bleak import BleakScanner, BleakClient
from bleak.exc import BleakError
import sqlite3

#tripple quotation mark for multi line strings in python
sensorstations_db_conn = sqlite3.connect('sensorstations.db')
sensorstations_db_conn.execute('''CREATE TABLE IF NOT EXISTS sensorstations_data
             (sensorstationname TEXT UNIQUE,
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



def update_sensorstations():
    with open("sensorstations.json", "r") as json_file:
        sensorstations = json.load(json_file) 

    
    for sensor in sensorstations["sensorstations"]:
        sensorstationname = sensor['name']
        transmissioninterval = sensor["transmissioninterval"]
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

        sensorstations_db_conn.execute('''INSERT OR REPLACE INTO sensorstations_data
                (sensorstationname, transmissioninterval,
                temperature_max, humidity_max, air_pressure_max, illuminance_max,
                air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, illuminance_min,
                air_quality_index_min, soil_moisture_min)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (sensorstationname, transmissioninterval,
                temperature_max, humidity_max, air_pressure_max, illuminance_max,
                air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, illuminance_min,
                air_quality_index_min, soil_moisture_min))
        sensorstations_db_conn.commit()

    sensorstations_db_conn.close()    

update_sensorstations()