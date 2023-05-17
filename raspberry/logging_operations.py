import logging
import datetime

#Configure logger
logging.basicConfig(filename='audit.log', format='%(asctime)s %(levelname)s: %(message)s')

log_data = []

async def log_to_file_and_list(level, message):
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')


    log_entry = {
        'timestamp': timestamp,
        'level': level,
        'message': message 
    }

    logger = getattr(logging, level)
    logger(message)

    log_data.append(log_entry)

async def clear_log_data():
    global log_data
    log_data.clear()