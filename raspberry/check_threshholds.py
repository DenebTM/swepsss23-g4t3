import common
import requests

async def check_values_for_thresholds(sensorstationClient, averages_dict, thresholds_dict):
    for sensor, average_value in averages_dict.items():
                if sensor in thresholds_dict:
                    max_threshold = thresholds_dict[sensor+"_max"]
                    min_threshold = thresholds_dict[sensor+"_min"]
                    if max_threshold is not None and average_value > max_threshold or average_value < min_threshold:
                         sendErrorToSensorstation(sensorstationClient, sensor)
                         sendErrorToBackend(sensorstationClient, sensor)
   
                        
async def sendErrorToSensorstation(sensorstationClient, sensor):
    errorCode = 1
    errorCodeByteArray = errorCode.to_bytes(1, byteorder='little')
    try:
        if sensor == "air_pressure":
            await sensorstationClient.write_gatt_char(common.air_quality_failure_uuid, errorCodeByteArray)
        if sensor == "temperature":
            await sensorstationClient.write_gatt_char(common.temperature_failure_uuid, errorCodeByteArray)
        elif sensor == "humidity":
            await sensorstationClient.write_gatt_char(common.humidity_failure_uuid, errorCodeByteArray)
        elif sensor == "illuminance":
            await sensorstationClient.write_gatt_char(common.illuminance_failure_uuid, errorCodeByteArray)
        elif sensor == "air_quality":
            await sensorstationClient.write_gatt_char(common.air_quality_failure_uuid, errorCodeByteArray)
        elif sensor == "soil_moisture":
            await sensorstationClient.write_gatt_char(common.soil_moisture_failure_uuid, errorCodeByteArray)
    except:
         print("couldnt write to gatt todo log")
    #TODO log error code


async def sendErrorToBackend(sensorstationClient, sensor):
    try:
        data = {'sensorstation': sensorstationClient.name, 'sensor': sensor}
        response = requests.post("idk address of errors", json=data)
    except:
        print("couldnt connect to backend or smth")
    
