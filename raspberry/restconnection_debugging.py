import requests
import time
import yaml
import asyncio
import json
from bleak import BleakScanner, BleakClient
from bleak.exc import BleakError
import sqlite3


sensor_station_name = "PH SensorStation" 
base_uuid = "0000{}-0000-1000-8000-00805f9b34fb"
temperature_uuid = base_uuid.format("2a6e")
humidity_uuid = base_uuid.format("2a6f")
air_pressure_uuid = base_uuid.format("2a6d")

sensordataDB = sqlite3.connect('sensordata.db')
sensordataCursor= sensordataDB.cursor()
sensordataDB = sqlite3.connect('sensordata.db')
sensordataCursor= sensordataDB.cursor()



with open("conf.example.yaml", "r") as f:
    config = yaml.safe_load(f)
    web_server_address = config["web_server_address"]
    web_server_address = "http://" + web_server_address
    print(web_server_address)

access_point_url = web_server_address.format("/access_point_placeholder")
sensor_search_url = web_server_address.format("/sensor_search")


async def find_stations():
    global air_pressure
    found_ss = []
    try:
        devices = await BleakScanner.discover()
        for d in devices:
            if sensor_station_name in d.name:
                found_ss.append(d)
                f = open("sensorstations.txt", "w")
                for ss in found_ss:
                    f.write(str(ss)+"\n")
                f.close
        
        if len(found_ss) == 0:
            print("No device found with name", sensor_station_name)
            
    except BleakError as e:
        print(f"Error: {e}")


async def add_stations_to_db():

    with open('sensorstations.json', 'r') as f:
        data = json.load(f)

    for ss in data['sensorstations']:
        name = ss['name']
        address = ss['address']
        thresholds = ','.join(str(t) for t in ss['thresholds'])
        sensordataCursor.execute('INSERT INTO sensorstations (name, address, thresholds) VALUES (?, ?, ?)', (name, address, thresholds))

    sensordataDB.commit()

    



while True:
    response = "n"
    response = input("do you want to receive data? y = yes n = no\n") 
    while response == "y":
        print('Connection allowed')
        while response == "y":
            response2 = input("do you want to start search for sensorstations? y = yes n = no\n")
            if response2 == "y":
                asyncio.run(find_stations())
                
            time.sleep(5)
            response = input("do you want to stay connected? y = yes n = no\n")

            

    else:
        print('Connection not allowed')

    time.sleep(5)


