import asyncio
import sys
import aiohttp
from bleak import BleakClient, BleakError

import common
from read_sensorvalues import read_sensorvalues
from db import db_conn
from search_for_sensorstations import search_for_sensorstations, send_sensorstations_to_backend


#amal alles aiohttp machen weil nid mischen
#define den return als a future dass i des im manage sensorstations sieh

async def get_ap_status(session):
    async with session.get(common.web_server_address + "/access-points/" + common.access_point_name) as response:
        data = await response.json()
        return data['status']
    
async def get_sensorstation_instructions(session):
    async with session.get(common.web_server_address + "/access-points/" + common.access_point_name + "/sensor-stations") as response:
        json_data = await response.json()

        paired_stations = {}
        for station in json_data:
            ss_id = station['id']
            ss_status = station['status']
            paired_stations[ss_id] = ss_status

        return paired_stations
    
async def sensor_station_manager(connection_request, session):
    tasks = {}  
    while not connection_request.done():
        sensorstations = await get_sensorstation_instructions(session)
        for ss, status in sensorstations.items():
            if status == "OFFLINE":
                try:
                    tasks[ss].cancel()
                except:
                    print(f"task_not_found", ss)
            elif status == "PAIRING":
                task = asyncio.create_task(sensor_station_tasks(connection_request, session, ss))
                    
        print("Finished SS Manager Loop")
        await asyncio.sleep(10)

async def sensor_station_tasks(connection_request, session, sensorstation):
    try:
        while not connection_request.done():
            async with BleakClient(sensorstation) as client:
                print("inside sensorstation tasks and inside connection")
                await read_sensorvalues(sensorstation)

    except BleakError as e:
        print(e)
        print("couldnt connect to sensorstation") #TODO: log and send to backend

async def polling_loop(connection_request, session):
        while not connection_request.done():
            print("Inside AP Loop")
            status = await get_ap_status(session)
            print("this is inside the ap loop and the status is" + status)
            if status == 'offline':
                connection_request.set_result("Done")
            elif status == 'searching':
                sensorstations = await search_for_sensorstations()
                await send_sensorstations_to_backend(session, sensorstations)
            await asyncio.sleep(10)

async def main():
    async with aiohttp.ClientSession() as session:
        connection_request = asyncio.Future()
        while True:
            print("This should only be Printed at the start and when AP is offline")
            async with session.post(common.web_server_address + "/access-points") as response:
                data = await response.json()
                print(data)
                if response.status == 200:
                    ap_status = await get_ap_status(session)
                    if ap_status == 'online' or ap_status == 'searching':
                        polling_loop_task = asyncio.create_task(polling_loop(connection_request, session))
                        sensor_station_manager_task = asyncio.create_task(sensor_station_manager(connection_request, session))
                        await asyncio.gather(polling_loop_task, sensor_station_manager_task)
                    else:
                        print('Access point is offline')
                        connection_request = asyncio.Future()
                        await asyncio.sleep(30)
                else:
                    print('webserver seems to be offline')
                    await asyncio.sleep(30)

asyncio.run(main())
