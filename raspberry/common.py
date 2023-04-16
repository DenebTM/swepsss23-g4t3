import yaml

log_filename = "communication.log"

sensor_station_name = "PH SensorStation"

#global constants taken out of the BLE Communication Spec
base_uuid = "0000{}-0000-1000-8000-00805f9b34fb"
temperature_uuid = base_uuid.format("2a6e")
humidity_uuid = base_uuid.format("2a6f")
air_pressure_uuid = base_uuid.format("2a6d")
illuminance_uuid = base_uuid.format("ff04")
air_quality_index_uuid = base_uuid.format("ff05")
soil_moisture_uuid = base_uuid.format("ff06")

#global constants for the error messages takne out of the ble communication Spec
error_service_uuid = base_uuid.format("ff00")
air_pressure_failure_uuid = base_uuid.format("ff01")
temperature_failure_uuid = base_uuid.format("ff02")
humidity_failure_uuid = base_uuid.format("ff03")
illuminance_failure_uuid = base_uuid.format("ff04")
air_quality_failure_uuid = base_uuid.format("ff05")
soil_moisture_failure_uuid = base_uuid.format("ff06")

#in seconds
polling_interval = 10

#Values taken from config.yaml file 
with open("conf.example.yaml", "r") as f:
    config = yaml.safe_load(f)
    web_server_address = config["web_server_address"]
    web_server_address = "http://" + web_server_address + "/accesspoints/"
    access_point_name = config["access_point_name"]
    access_point_address = web_server_address + access_point_name
