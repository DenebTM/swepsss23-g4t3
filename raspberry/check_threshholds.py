import common
import requests

async def check_values_for_thresholds(sensorstationClient, averages_dict, thresholds_dict):
    for sensor, average_value in averages_dict.items():
                if sensor in thresholds_dict:
                    max_threshold = thresholds_dict[sensor+"_max"]
                    min_threshold = thresholds_dict[sensor+"_min"]
                    if max_threshold is not None and average_value > max_threshold or average_value < min_threshold:
                         send_error_to_sensorstation(sensorstationClient, sensor)
                         send_error_to_backend(sensorstationClient, sensor)
   
                        
async def send_error_to_sensorstation(sensor_station_client, sensor):
    errorCode = 1
    errorCodeByteArray = errorCode.to_bytes(1, byteorder='little')
    try:
        sensor_uuid = common.sensor_uuids[sensor]
        await sensor_station_client.write_gatt_char(sensor_uuid, errorCodeByteArray)
    except:
         print("couldnt write to gatt todo log")
    #TODO log error code


async def send_error_to_backend(sensor_station_client, sensor):
    try:
        data = {'sensorstation': sensor_station_client.name, 'sensor': sensor}
        requests.post("idk address of errors", json=data)
    except:
        print("couldnt connect to backend or smth")
    
