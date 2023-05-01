import asyncio
import sys
import aiohttp
import requests
import time
import logging

import common
from read_sensorvalues import read_sensorvalues
from db import db_conn
from search_for_sensorstations import search_for_sensorstations

#amal alles aiohttp machen weil nid mischen
#define den return als a future dass i des im manage sensorstations sieh

async def spawn_sensorstation_tasks(sensorstations):
    for sensorstation in sensorstations:
        await asyncio.create_task(read_sensorvalues(sensorstation))

async def cancel_sensorstation_tasks(sensorstation, sensorstation_tasks):
    for sensorstation in sensorstation:
        pass #TODO cancel tasks marked as offline


async def get_ap_status(session):
    async with session.get(common.web_server_address + "/access-points/" + common.access_point_name) as response:
        data = await response.json()
        return data['status']
    
async def get_sensorstation_instructions(session):
    async with session.get(common.web_server_address + "/access-points/" + common.access_point_name + "/sensor-stations") as response:
        data = await response.json()
        return data
    
async def sensor_station_manager(connection_request, session):
    tasks = {}  
    while not connection_request.done():
        print("these 2 tasks should run concurrently")
        instructions = await get_sensorstation_instructions(session)
        print(instructions)
        
        await asyncio.sleep(10)

async def sensor_station_tasks(connection_request, session, bleak_conn):
    pass




async def polling_loop(connection_request, session):
        while not connection_request.done():
            print("inside the inner loop")
            status = await get_ap_status(session)
            if status == 'offline':
                connection_request.set_result("Done")
            elif status == 'searching':
                await search_for_sensorstations()

            await asyncio.sleep(10)

async def main():
    async with aiohttp.ClientSession() as session:
        connection_request = asyncio.Future()
        while True:
            print("i should only print this when the access point is offline or once at start")
            async with session.post(common.web_server_address + "/access-points") as response:
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
