import common
from database_operations import get_sensor_data_thresholds, get_sensor_data_averages
import asyncio

#TODO: deneb fragen wo die ID gspeichert is

async def check_values_for_thresholds(sensorstation_client, sensorstation_id, transmission_interval):
    await asyncio.sleep(transmission_interval)
    try:
        thresholds_dict = await get_sensor_data_thresholds(sensorstation_id)
        averages_dict = await get_sensor_data_averages(sensorstation_id)
        for sensor, average_value in averages_dict.items():
            if sensor in thresholds_dict:
                max_threshold = thresholds_dict[sensor+"_max"]
                min_threshold = thresholds_dict[sensor+"_min"]
                if not min_threshold <= average_value <= max_threshold:
                    send_error_to_sensorstation(sensorstation_client, sensorstation_id)
                    send_error_to_backend(sensorstation_client, sensorstation_id)
    except Exception as e:
        print(e)

                        
async def send_error_to_sensorstation(sensor_station_client, sensor):
    errorCode = 1
    errorCodeByteArray = errorCode.to_bytes(1, byteorder='little')
    try:
        sensor_uuid = common.sensor_uuids[sensor]
        await sensor_station_client.write_gatt_char(sensor_uuid, errorCodeByteArray)
    except:
         print("couldnt write to gatt")
    #TODO log error code


async def send_error_to_backend(sensor_station_client, sensor):
    try:
        data = {'sensorstation': sensor_station_client.name, 'sensor': sensor}
        #request.post("idk address of errors", json=data)
    except:
        print("couldnt connect to backend or smth")
    