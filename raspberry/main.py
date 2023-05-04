import asyncio
import sys
import aiohttp
from bleak import BleakClient, BleakError
import json
import yaml

import common
import database_operations
from read_sensorvalues import read_sensorvalues, send_sensorvalues_to_backend
from db import db_conn
from search_for_sensorstations import search_for_sensorstations, send_sensorstations_to_backend, send_sensorstation_connection_status
from check_threshholds import check_values_for_thresholds

async def get_ap_status(session):
    async with session.get(common.web_server_address + "/access-points/" + common.access_point_name) as response:
        data = await response.json()
        return data['status']
    
async def get_sensorstation_instructions(session):
    async with session.get(common.web_server_address + "/access-points/" + common.access_point_name + "/sensor-stations") as response:
        data = await response.json()
        return data
    
async def sensor_station_manager(connection_request, session):
    while not connection_request.done():
        common.known_sensorstations = await load_or_create_known_sensorstation_json()
        print(common.known_sensorstations)
        sensorstations = await get_sensorstation_instructions(session)
        for sensorstation in sensorstations:
            for sensorstation_id, instruction in sensorstation.items():
                sensorstation_id = int(sensorstation_id)
                if instruction == "ONLINE":
                    if not sensorstation_id in common.connected_sensorstations_with_tasks and sensorstation_id in common.known_sensorstations:
                        task = asyncio.create_task(sensor_station_tasks(connection_request, session, sensorstation_id))
                        common.connected_sensorstations_with_tasks[sensorstation_id] = task
                if instruction == "OFFLINE":
                    try:
                        common.connected_sensorstations_with_tasks[sensorstation_id].cancel()
                        del common.connected_sensorstations_with_tasks[sensorstation_id]
                    except:
                        print(f"task_not_found", sensorstation_id)
                elif instruction == "PAIRING":
                    if not sensorstation_id in common.connected_sensorstations_with_tasks:
                        task = asyncio.create_task(sensor_station_tasks(connection_request, session, sensorstation_id))
                        common.connected_sensorstations_with_tasks[sensorstation_id] = task
                    
        print("Finished SS Manager Loop")
        await asyncio.sleep(10)

async def load_or_create_known_sensorstation_json():
    try:
        with open ('known_sensorstations.yaml', 'r') as file:
                known_sensorstations = yaml.safe_load(file)    
    except FileNotFoundError:
        with open ('known_sensorstations.yaml', 'w') as file:
            known_sensorstations = {}
            yaml.dump(known_sensorstations, file)
    return known_sensorstations

async def sensor_station_tasks(connection_request, session, sensorstation_id):
    #TODO: Catch cancelled Error and error handle stuff
    try:
        if not sensorstation_id in common.known_sensorstations:
            print("Sensorstation " + str(sensorstation_id) + " was never known before")

        sensorstation_mac = common.known_sensorstations[sensorstation_id]
        try:
            transmission_interval = common.polling_interval
            async with BleakClient(sensorstation_mac) as client:
                print("i was connected to the sensorstation")
                await send_sensorstation_connection_status(session, sensorstation_id, "ONLINE")
                await database_operations.initialize_sensorstation(sensorstation_id)

                while not connection_request.done():
                    await read_sensorvalues(client, sensorstation_id)
                    await check_values_for_thresholds(client, sensorstation_id, transmission_interval)
                    await send_sensorvalues_to_backend(sensorstation_id, session, transmission_interval)
                    #TODO: Update sensorstations_thressholds
                    #TODO: Check for thressholds

        except BleakError as e:
            await send_sensorstation_connection_status(session, sensorstation_id, "PAIRING_FAILED")
            await send_sensorstation_pairing_failed(session, sensorstation_id, "PAIRING_FAILED")
            print(e)
            print("couldnt connect to sensorstation") #TODO: log and send to backend
        except Exception as e:
            print("Other exception in sensorstation task", e.with_traceback())
        except:
            print('??????????')
    except Exception as e:
        print("Pairing failed", e.with_traceback())
        await send_sensorstation_pairing_failed(session, sensorstation_id, "PAIRING_FAILED")

        #TODO: log and send to backend failure


async def send_sensorstation_pairing_failed(session, sensorstation_id, message):
        #await send_sensorstation_connection_status(session, sensorstation_id, message)
        common.connected_sensorstations_with_tasks[sensorstation_id].cancel()
        del common.connected_sensorstations_with_tasks[sensorstation_id]
        

async def polling_loop(connection_request, session):
        while not connection_request.done():
            print("Inside AP Loop")
            status = await get_ap_status(session)
            print("this is inside the ap loop and the status is " + status)
            if status == 'offline':
                connection_request.set_result("Done")
            elif status == 'searching':
                sensorstations = await search_for_sensorstations()
                await send_sensorstations_to_backend(session, sensorstations)
            await asyncio.sleep(10)

async def main():
        while True:
            async with aiohttp.ClientSession() as session:
                connection_request = asyncio.Future()
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
