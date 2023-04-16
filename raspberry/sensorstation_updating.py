import json

from db import db_conn

async def update_sensorstations(json_data):
    data = json.loads(json_data)
    sensorstation = data["sensorstation"]

    with db_conn:
        try:
            sensorstationname = sensorstation["name"]
            transmisstioninterval = sensorstation["transmissioninterval"]
            thresholds = sensorstation["thresholds"]
            temperature_max = thresholds["temperature_max"]
            humidity_max = thresholds["humidity_max"]
            air_pressure_max = thresholds["air_pressure_max"]
            illuminance_max = thresholds["illuminance_max"]
            air_quality_index_max = thresholds["air_quality_index_max"]
            soil_moisture_max = thresholds["soil_moisture_max"]
            temperature_min = thresholds["temperature_min"]
            humidity_min = thresholds["humidity_min"]
            air_pressure_min = thresholds["air_pressure_min"]
            illuminance_min = thresholds["illuminance_min"]
            air_quality_index_min = thresholds["air_quality_index_min"]
            soil_moisture_min = thresholds["soil_moisture_min"]

            db_conn.execute(
                '''INSERT INTO sensorstations
                (sensorstationname, transmissioninterval,
                temperature_max, humidity_max, air_pressure_max, illuminance_max,
                air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, illuminance_min,
                air_quality_index_min, soil_moisture_min)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (sensorstationname, transmisstioninterval,
                temperature_max, humidity_max, air_pressure_max, illuminance_max,
                air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, illuminance_min,
                air_quality_index_min, soil_moisture_min))
        except Exception as e:
            db_conn.rollback()
            print(f"Error inserting data for sensorstation {sensorstationname}: {e}")
