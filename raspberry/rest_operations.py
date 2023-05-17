import common
import asyncio
import aiohttp
import json
import database_operations
import functools
import time

STATUS_CODE_OK = 200
AUTH_TOKEN = ''
AUTH_HEADER = {'Authorization': f'Bearer {AUTH_TOKEN}'}

# This function makes it so that each rest call retries 5 times before raising an ClientConnectionError
def retry_connection_error(retries=5, interval=3):
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            for i in range(retries):
                try:
                    return await func(*args, **kwargs)
                except aiohttp.ClientConnectionError:
                    await asyncio.sleep(interval)
                    print(f'Retrying in {func.__name__}. Attempt {i+1} out of {retries}')
                    # TODO: Log this for specific function with func.__name__
            raise aiohttp.ClientConnectionError(f"ClientConnectionError in function '{func.__name__}'")
        return wrapper  # Moved outside the for loop
    return decorator

@retry_connection_error(retries = 3, interval = 5)
async def initialize_accesspoint(session):
    global AUTH_TOKEN
    data = json.dumps({'name': common.access_point_name, 'serverAddress': common.web_server_address})
    try:
        async with session.post('/api/access-points', json=data) as response:
            json_data = await response.json()
            AUTH_TOKEN = json_data['token'] 
            return True
    except aiohttp.ClientResponseError as e:
        return False
        #TODO: Log this

@retry_connection_error(retries = 3, interval = 5)
async def get_ap_status(session):
    async with session.get('/api/access-points/' + common.access_point_name, headers=AUTH_HEADER) as response:
        #TODO: Log this
        try:
            data = await response.json()
            return data['status']
        except json.decoder.JSONDecodeError as e:
            #TODO: Log this
            return None

@retry_connection_error(retries = 3, interval = 5)
async def get_sensorstation_instructions(session):
    paired_stations = {}
    async with session.get('/api/access-points/' + common.access_point_name + '/sensor-stations', headers=AUTH_HEADER) as response:
        try:
            json_data = await response.json()
            for station in json_data:
                ss_id = station['id']
                ss_status = station['status']
                if ss_status != 'AVAILABLE':
                    paired_stations[ss_id] = ss_status
        except json.decoder.JSONDecodeError as e:
            #TODO: log this
            return paired_stations
        except KeyError as e:
            #TODO: log this
            return paired_stations
    return paired_stations

@retry_connection_error(retries = 3, interval = 5)
async def send_sensorstations_to_backend(session, sensorstations):
    ss_avail = list(map(lambda id: { 'ssID': id, 'status': 'AVAILABLE' }, sensorstations))
    async with session.post('/api/access-points/' + common.access_point_name + '/sensor-stations', json=ss_avail, headers=AUTH_HEADER) as response:
        pass
        #TODO: Log this

@retry_connection_error(retries = 3, interval = 5)
async def send_sensorstation_connection_status(session, sensorstation, status):
    ss_status = {
        'accessPoint': common.access_point_name,
        'status': status
    }
    async with session.put('/api/sensor-stations/' + str(sensorstation), json=ss_status, headers=AUTH_HEADER) as response:
        pass
        #TODO: Log this

@retry_connection_error(retries = 3, interval = 5)
async def send_warning_to_backend(sensorstation_id, session):
    data = {'id': sensorstation_id, 'status': 'WARNING'}
    async with session.put('/api/sensor-stations/' + str(sensorstation_id), json=data, headers=AUTH_HEADER) as response:
        pass
        #TODO: Log communication

@retry_connection_error(retries = 3, interval = 5)
async def clear_warning_on_backend(sensorstation_id, session, data):
    if int.from_bytes(data, 'little', signed=False) == 0:
        data = {'id': sensorstation_id, 'status': 'OK'}
        async with session.put('/api/sensor-stations/' + str(sensorstation_id), json=data, headers=AUTH_HEADER) as response:
            pass
            print(response.status)
            #TODO: Log communication

@retry_connection_error(retries = 3, interval = 5)
async def get_thresholds_update_db(sensorstation_id, session):
    async with session.get('/api/sensor-stations/' + str(sensorstation_id)) as response:
        json_data = await response.json()
        await database_operations.update_sensorstation(json_data)
        #TODO: implement try catch. also implement disconnection from sensorstation if not allowed
        #TODO: skip it if webserver is offline as we wont get a functioning response 

@retry_connection_error(retries = 3, interval = 5)
async def send_sensorvalues_to_backend(sensorstation_id, session):
    averages_dict = await database_operations.get_sensor_data_averages(sensorstation_id)
    if averages_dict:
        averages_dict['timestamp'] = int(time.time())
        averages_json = json.dumps(averages_dict)
        async with session.post('/api/sensor-station/' + str(sensorstation_id) + '/measurements', json=averages_json, headers=AUTH_HEADER) as response:
            if response.status == STATUS_CODE_OK:
                await database_operations.clear_sensor_data(sensorstation_id)
                #TODO:Log this communication
            else:
                pass
                #TODO: Log this and error handle
    else:
        print('averages_dict is empty')
        #TODO: Log this