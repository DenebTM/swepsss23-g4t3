import common
from database_operations import update_sensorstation

async def get_ap_status(session):
    async with session.get('/access-points/' + common.access_point_name) as response:
        if response.status == 200:
            data = await response.json()
            return data['status']
        

async def get_sensorstation_instructions(session):
    paired_stations = {}
    async with session.get('/access-points/' + common.access_point_name + '/sensor-stations') as response:
        if response.status == 200:
            json_data = await response.json()
            for station in json_data:
                ss_id = station['id']
                ss_status = station['status']
                paired_stations[ss_id] = ss_status
        return paired_stations
    

async def initialize_accesspoint(session):
    async with session.post('/access-points') as response:
        return response
    
async def send_sensorstations_to_backend(session, sensorstations):
    ss_avail = list(map(lambda id: { 'id': id, 'status': 'AVAILABLE' }, sensorstations))
    async with session.post('/access-points/' + common.access_point_name + '/sensor-stations', json=ss_avail) as response:
        if response.status == 200:
            pass

async def send_sensorstation_connection_status(session, sensorstation, status):
    ss_status = {
        'accessPoint': common.access_point_name,
        'status': status
    }
    async with session.put('/sensor-stations/' + str(sensorstation), json=ss_status) as response:
        if response.status == 200:
            pass

async def send_warning_to_backend(sensorstation_id, session):
    data = {'id': sensorstation_id, 'status': 'WARNING'}
    async with session.put('/sensor-stations/' + str(sensorstation_id), json=data) as response:
        if response.status == 200:
            pass
    #TODO: Log communication

async def clear_warning_on_backend(sensorstation_id, session, data):
    if int.from_bytes(data, 'little', signed=False) == 0:
        data = {'id': sensorstation_id, 'status': 'OK'}
        async with session.put('/sensor-stations/' + str(sensorstation_id), json=data) as response:
            if response.status == 200:
                pass
                print(response.status)
                #TODO: Log communication

async def get_thresholds_update_db(sensorstation_id, session):
    async with session.get('/sensor-stations/' + str(sensorstation_id)) as response:
        if response.status == 200:
            json_data = await response.json()
            await update_sensorstation(json_data)
        #TODO: implement try catch. also implement disconnection from sensorstation if not allowed
        #TODO: skip it if webserver is offline as we wont get a functioning response 