import logging
import datetime

from common import access_point_name

# Configure logger
logging.basicConfig(filename='audit.log', format='%(asctime)s %(levelname)s: %(message)s')

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

    logging.log(getattr(logging, level), message)

    log_data.append(log_entry)

async def clear_log_data():
    global log_data
    log_data.clear()
