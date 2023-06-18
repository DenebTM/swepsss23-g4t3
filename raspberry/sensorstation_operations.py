from bleak import BleakScanner
from bleak.exc import BleakError
import common
import logging_operations


#Should return a dictionary of all found sensorstations with key = name, value = ID
async def search_for_sensorstations():
    try:
        sensorstations = []
        async with BleakScanner() as scanner:
            await scanner.stop() # end scanning process for sure to avoid conflicts
            devices = await scanner.discover()
            for d in devices:
                if common.sensor_station_name in d.name:
                    ss_uuid = int.from_bytes(d.details['props']['ServiceData'][common.device_information_uuid], byteorder='little', signed=False)
                    sensorstations.append(ss_uuid)
                    common.known_ss[ss_uuid] = d.address
                    common.save_known_ss()
            await scanner.stop()
            if len(sensorstations) > 0:
                await logging_operations.log_local_and_remote('INFO', f'Sensorstations found are : {sensorstations}')
            else:
                await logging_operations.log_local_and_remote('INFO', 'No sensorstations were found')       
        return sensorstations   
    
    except BleakError as e:
        await logging_operations.log_local_and_remote('ERROR', f'BleakError occured while searching for sensorstations. Error: {e}')
        return sensorstations
