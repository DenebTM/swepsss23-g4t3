import logging
import datetime
import asyncio
from common import access_point_name
import rest_operations

SENDING_INTERVAL = 60

# Configure logger
logging.basicConfig(filename='audit.log', format='%(asctime)s %(levelname)s: %(message)s', level=logging.INFO)

log_data = []

async def log_to_file_and_list(level, message, entity_type='ACCESS_POINT', entity_id=access_point_name):
    timestamp = datetime.datetime.utcnow().isoformat()

    log_entry = {
        'timestamp': timestamp+'Z',  # For backend reasons
        'level': level,
        'message': message,
        'origin': {
            'type': entity_type,        # 'ACCESS_POINT'/'SENSOR_STATION'
            'id': entity_id             # access_point_name or sensor_station.ssID
        }
    }

    #logging.log(getattr(logging, level), message)
    logging.log(getattr(logging, level), message)

    log_data.append(log_entry)

async def clear_log_data():
    global log_data
    log_data.clear()

async def log_sending_loop(session, connection_request):
    while not connection_request.done():
        await asyncio.sleep(SENDING_INTERVAL)
        await rest_operations.send_logs(session, log_data)