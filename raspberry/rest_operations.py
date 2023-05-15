import common
import asyncio
import aiohttp
import json
import database_operations
import functools
import time

STATUS_CODE_OK = 200
STATUS_CODE_UNATHORIZED = 401

# This function makes it so that each rest call retries 5 times before raising an ClientConnectionError
def retry_connection_error(retries=5, interval=3):
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            for _ in range(retries):
                try:
                    return await func(*args, **kwargs)
                except aiohttp.ClientConnectionError:
                    await asyncio.sleep(interval)
                    print(f'retrying rn in {func.__name__}')
                    # TODO: Log this for specific function with func.__name__
            raise aiohttp.ClientConnectionError(f"ClientConnectionError in function '{func.__name__}'")
        return wrapper  # Moved outside the for loop
    return decorator

@retry_connection_error(retries = 3, interval = 5)
async def get_ap_status(session):
    async with session.get('/access-points/' + common.access_point_name) as response:
        #TODO: Log this
        if response.status == STATUS_CODE_OK:
            try:
                data = await response.json()
                return data['status']
            except json.decoder.JSONDecodeError as e:
                #TODO: Log this
                return None

@retry_connection_error(retries = 3, interval = 5)
async def get_sensorstation_instructions(session):
    paired_stations = {}
    async with session.get('/access-points/' + common.access_point_name + '/sensor-stations') as response:
        if response.status == STATUS_CODE_OK:
            try:
                json_data = await response.json()
                for station in json_data:
                    ss_id = station['id']
                    ss_status = station['status']
                    paired_stations[ss_id] = ss_status
            except json.decoder.JSONDecodeError as e:
                #TODO: log this
                return paired_stations
        return paired_stations

@retry_connection_error(retries = 3, interval = 5)
async def initialize_accesspoint(session):
    async with session.post('/access-points') as response:
        return response

@retry_connection_error(retries = 3, interval = 5)
async def send_sensorstations_to_backend(session, sensorstations):
    ss_avail = list(map(lambda id: { 'id': id, 'status': 'AVAILABLE' }, sensorstations))
    async with session.post('/access-points/' + common.access_point_name + '/sensor-stations', json=ss_avail) as response:
        if response.status == 200:
            pass

@retry_connection_error(retries = 3, interval = 5)
async def send_sensorstation_connection_status(session, sensorstation, status):
    ss_status = {
        'accessPoint': common.access_point_name,
        'status': status
    }
    async with session.put('/sensor-stations/' + str(sensorstation), json=ss_status) as response:
        if response.status == 200:
            pass

@retry_connection_error(retries = 3, interval = 5)
async def send_warning_to_backend(sensorstation_id, session):
    data = {'id': sensorstation_id, 'status': 'WARNING'}
    async with session.put('/sensor-stations/' + str(sensorstation_id), json=data) as response:
        if response.status == 200:
            pass
    #TODO: Log communication

@retry_connection_error(retries = 3, interval = 5)
async def clear_warning_on_backend(sensorstation_id, session, data):
    if int.from_bytes(data, 'little', signed=False) == 0:
        data = {'id': sensorstation_id, 'status': 'OK'}
        async with session.put('/sensor-stations/' + str(sensorstation_id), json=data) as response:
            if response.status == 200:
                pass
                print(response.status)
                #TODO: Log communication

@retry_connection_error(retries = 3, interval = 5)
async def get_thresholds_update_db(sensorstation_id, session):
    async with session.get('/sensor-stations/' + str(sensorstation_id)) as response:
        if response.status == 200:
            json_data = await response.json()
            await database_operations.update_sensorstation(json_data)
        #TODO: implement try catch. also implement disconnection from sensorstation if not allowed
        #TODO: skip it if webserver is offline as we wont get a functioning response 

@retry_connection_error(retries = 3, interval = 5)
async def send_sensorvalues_to_backend(sensorstation_id, session):
    averages_dict = await database_operations.get_sensor_data_averages(sensorstation_id)
    averages_dict['timestamp'] = int(time.time())
    averages_json = json.dumps(averages_dict)
    async with session.post('/sensor-station/' + str(sensorstation_id) + '/measurements', json=averages_json) as response:
        if response.status == 200:
            await database_operations.clear_sensor_data(sensorstation_id)
            #TODO:Log this communication
        else:
            pass
            #TODO: Log this and error handle
