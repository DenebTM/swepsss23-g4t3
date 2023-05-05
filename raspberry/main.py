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
from check_thresholds import check_values_for_thresholds

async def get_ap_status(session):
    async with session.get(common.web_server_address + '/access-points/' + common.access_point_name) as response:
        data = await response.json()
        return data['status']
    
async def get_sensorstation_instructions(session):
    async with session.get(common.web_server_address + '/access-points/' + common.access_point_name + '/sensor-stations') as response:
        json_data = await response.json()

        paired_stations = {}
        for station in json_data:
            ss_id = station['id']
            ss_status = station['status']
            paired_stations[ss_id] = ss_status

        return paired_stations

# Currently active sensor station tasks
ss_tasks = {}
async def sensor_station_manager(connection_request, session):
    global ss_tasks
    while not connection_request.done():
        sensorstations = await get_sensorstation_instructions(session)
        for ss_id, status in sensorstations.items():
            ss_id = int(ss_id)
            if status == 'ONLINE':
                if ss_id in common.known_ss and not ss_id in ss_tasks:
                    task = asyncio.create_task(sensor_station_task(connection_request, session, ss_id))
                    ss_tasks[ss_id] = task
            elif status == 'PAIRING':
                if not ss_id in common.ss_tasks:
                    task = asyncio.create_task(sensor_station_task(connection_request, session, ss_id))
                    ss_tasks[ss_id] = task
            if status == 'OFFLINE':
                try:
                    ss_tasks[ss_id].cancel()
                    del ss_tasks[ss_id]
                except:
                    print(f'task not found for SS', ss_id)
                    
        print('Finished SS Manager Loop')
        await asyncio.sleep(10)

async def sensor_station_task(connection_request, session, sensorstation_id):
    #TODO: Catch cancelled Error and error handle stuff
    try:
        if not sensorstation_id in common.known_ss:
            print('Sensorstation ' + str(sensorstation_id) + ' was never known before')

        sensorstation_mac = common.known_ss[sensorstation_id]
        try:
            transmission_interval = common.polling_interval
            async with BleakClient(sensorstation_mac) as client:
                print('i was connected to the sensorstation')
                await send_sensorstation_connection_status(session, sensorstation_id, 'ONLINE')
                await database_operations.initialize_sensorstation(sensorstation_id)

                while not connection_request.done():
                    await read_sensorvalues(client, sensorstation_id)
                    await check_values_for_thresholds(client, sensorstation_id, transmission_interval)
                    await send_sensorvalues_to_backend(sensorstation_id, session, transmission_interval)
                    #TODO: Update sensorstations_thresholds
                    #TODO: Check for thresholds

        except BleakError as e:
            await send_sensorstation_connection_status(session, sensorstation_id, 'PAIRING_FAILED')
            await send_sensorstation_pairing_failed(session, sensorstation_id, 'PAIRING_FAILED')
            print(e)
            print('couldnt connect to sensorstation') #TODO: log and send to backend
        except Exception as e:
            print('Other exception in sensorstation task', e.with_traceback())
        except:
            print('??????????')
    except Exception as e:
        print('Pairing failed', e.with_traceback())
        await send_sensorstation_pairing_failed(session, sensorstation_id, 'PAIRING_FAILED')

        #TODO: log and send to backend failure


async def send_sensorstation_pairing_failed(session, sensorstation_id, message):
    #await send_sensorstation_connection_status(session, sensorstation_id, message)
    common.ss_tasks[sensorstation_id].cancel()
    del common.ss_tasks[sensorstation_id]
        

async def polling_loop(connection_request, session):
    while not connection_request.done():
        print('Inside AP Loop')
        status = await get_ap_status(session)
        print('this is inside the ap loop and the status is ' + status)
        if status == 'OFFLINE':
            connection_request.set_result('Done')
        elif status in ['ONLINE', 'SEARCHING']:
            sensorstations = await search_for_sensorstations()
            await send_sensorstations_to_backend(session, sensorstations)
        await asyncio.sleep(10)

async def main():
    while True:
        async with aiohttp.ClientSession() as session:
            connection_request = asyncio.Future()
            print('This should only be Printed at the start and when AP is offline')
            async with session.post(common.web_server_address + '/access-points') as response:
                data = await response.json()
                print(data)
                if response.status == 200:
                    ap_status = await get_ap_status(session)
                    if ap_status in ['ONLINE', 'SEARCHING']:
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
