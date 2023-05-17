import asyncio
import aiohttp
import time
from bleak import BleakClient, BleakError

import common
import database_operations
from thresholds_operations import check_values_for_thresholds
from sensorvalues_operations import read_sensorvalues
from sensorstation_operations import search_for_sensorstations
import rest_operations

# Currently active sensor station tasks
ss_tasks = {}
async def sensor_station_manager(connection_request, session):
    global ss_tasks
    while not connection_request.done():
        new_assigned_ss = await rest_operations.get_sensorstation_instructions(session)
        #This so the program wont crash if the Webserver is down and just keeps the last sensorstation instructions if down
        if new_assigned_ss is not None:
            assigned_ss = new_assigned_ss

        for ss_id in common.known_ss:
            if ss_id in assigned_ss:
                if ss_id in ss_tasks and ss_tasks[ss_id].done():
                    del ss_tasks[ss_id]
                if not ss_id in ss_tasks:
                    ss_status = assigned_ss[ss_id]
                    task = asyncio.create_task(sensor_station_task(connection_request, session, ss_id,
                                                                   first_time=(ss_status == 'PAIRING')))
                    ss_tasks[ss_id] = task
            
            # cancel tasks for sensor stations not assigned to this AP, if present
            else:
                if ss_id in ss_tasks:
                    try:
                        ss_tasks[ss_id].cancel()
                        del ss_tasks[ss_id]
                    except:
                        print(f"error canceling task for", ss_id)

        print('Finished SS Manager Loop')
        await asyncio.sleep(10)

async def sensor_station_task(connection_request, session, sensorstation_id, first_time):
    sensorstation_mac = common.known_ss[sensorstation_id]
    try:
        transmission_interval = common.polling_interval
        async with BleakClient(sensorstation_mac) as client:
            await rest_operations.send_sensorstation_connection_status(session, sensorstation_id, 'ONLINE')
            await database_operations.initialize_sensorstation(sensorstation_id)
            asyncio.create_task(read_sensorvalues(client, sensorstation_id, connection_request))
            while not connection_request.done() and client.is_connected:
                transmission_interval = await database_operations.get_sensorstation_transmissioninterval(sensorstation_id)
                await asyncio.sleep(transmission_interval)
                await check_values_for_thresholds(client, sensorstation_id, session)
                await rest_operations.send_sensorvalues_to_backend(sensorstation_id, session)
                await rest_operations.get_thresholds_update_db(sensorstation_id, session)

    except BleakError as e:
        print(e)
        print('couldnt connect to sensorstation') 
        error_status = 'PAIRING_FAILED' if first_time else 'OFFLINE'
        await rest_operations.send_sensorstation_connection_status(session, sensorstation_id, error_status)
        await cancel_ss_task(sensorstation_id)
        #TODO: log and send to backend
    except Exception as e:
        #TODO: log and send to backend
        print('Other exception in sensorstation task', e.with_traceback())

async def cancel_ss_task(sensorstation_id):
    global ss_tasks
    ss_tasks[sensorstation_id].cancel()
    del ss_tasks[sensorstation_id]

        
async def polling_loop(connection_request, session):
    while not connection_request.done():
        print('Inside AP Loop')
        new_status = await rest_operations.get_ap_status(session)
        if new_status is not None:
            status = new_status
        print('this is inside the ap loop and the status is ' + status)
        if status == 'OFFLINE':
            connection_request.set_result('Done')
        elif status == 'SEARCHING':
            sensorstations = await search_for_sensorstations()
            await rest_operations.send_sensorstations_to_backend(session, sensorstations)
        await asyncio.sleep(10)

async def main():
    while True:
        async with aiohttp.ClientSession(base_url=common.web_server_address) as session:
            connection_request = asyncio.Future()
            print('This should only be Printed at the start and when AP is offline')
            response = await rest_operations.initialize_accesspoint(session)
            if response.status == 200:
                ap_status = await rest_operations.get_ap_status(session)
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

if __name__ == '__main__':
    retry_time = 5
    while True:
        try:
            asyncio.run(main())
            break
        except aiohttp.ClientConnectionError as e:
            print(f'Could not reach PlantHealth server. Retrying in {retry_time} seconds')
            time.sleep(retry_time)
            retry_time = retry_time+5 if retry_time < 60 else 60
            #TODO:Log this
        
        except Exception as e:
            print(f'Unexpected error occured: {e}')
            #TODO:Log this
