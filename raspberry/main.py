import asyncio
import sys
import aiohttp
import requests
import time
import logging

import common
from read_sensor_and_save_to_db import read_and_send_sensorvalues
from db import db_conn
from search_for_sensorstations import search_for_sensorstations


async def send_connection_request(session):
    # TODO
    pass

async def listen_for_instructions(session):
    async with aiohttp.ClientSession(common.web_server_address + "/access_points/name") as session:
        connection_allowed = await send_connection_request(session)
        while connection_allowed:
            pass


async def spawn_sensorstation_tasks(sensorstations):
    for sensorstation in sensorstations:
        await asyncio.create_task(read_and_send_sensorvalues(sensorstation))

async def check_values_for_thresholds(sensorstation):
    current_time = int(time.time())
    five_min_ago = current_time - 300

    with db_conn:
        try:
            averages_query = db_conn.execute(
                f'''SELECT AVG(temperature) AS temp_avg, AVG(humidity) AS humidity_avg,
                AVG(air_pressure) AS air_pressure_avg, AVG(illuminance) AS illuminance_avg,
                AVG(air_quality_index) AS air_quality_index_avg, AVG(soil_moisture) AS soil_moisture_avg
                FROM sensordata
                WHERE sensorstationname = ?
                AND timestamp >= ?''',
                (sensorstation.name, five_min_ago)
            )

            averages_dict = dict(averages_query.fetchone())

            thresholds_query = db_conn.execute(
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
                        # return function with name of sensor who is out of bounds to send to sensorstation and backend
                        # send errorcode to backend and let light of sensorstation glow
        except:
            pass

# async def send_error(sensorstation, sensor):
#     service = await sensorstation.get_service(error_service_uuid)
#     characteristic = await service.get_characteristic(characteristic_uuid)

#     # Convert the value to bytes and write it to the characteristic
#     value_bytes = bytes(value)
#     await characteristic.write_value(value_bytes)
#     pass


async def main():
    while True:
        sensorstations = await search_for_sensorstations()

        await spawn_sensorstation_tasks(sensorstations)
    #     # send to /accesspoints that i exist POST
    #     access_point = {'name': common.access_point_name}
    #     try:
    #         response = requests.post(common.web_server_address, json = access_point, timeout=3)
    #         # response is id:(id), active:(True oder False), name:(mei name)
    #         if response == 200:
    #             polling_loop = asyncio.new_event_loop()
    #             polling_loop.create_tast(listen_for_instructions)
    #             polling_loop.run_forever()
            
    #     except requests.ConnectTimeout:
    #         print("Could not connect to backend", file=sys.stderr)

# search_loop = asyncio.new_event_loop()
# asyncio.set_event_loop(search_loop)
# search_loop.create_task(search_for_sensorstations())
# search_loop.run_forever()
asyncio.run(main())
