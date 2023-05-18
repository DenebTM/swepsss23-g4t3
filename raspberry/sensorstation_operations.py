from bleak import BleakScanner
from bleak.exc import BleakError
import common


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
                #TODO: Implement logging info with which sensorstations are found
                print('Found sensor stations:', sensorstations)
            else:
                #TODO: Implement logging warning that no sensorstations are found
                print('No sensor stations found...')
            
        return sensorstations   
    
    except BleakError as e:
        # write error to audit log
        print(f'Error: {e}')
        return sensorstations
