import time
import json
from db import db_conn
import common

current_time = int(time.time())
five_min_ago = current_time - 300

async def save_sensor_values_to_database(sensorstation_id, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture):
    try:
        db_conn.execute("INSERT INTO sensordata (id, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                        (sensorstation_id, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture, int(time.time())))
        db_conn.commit()
    except Exception as e:
        print(e)
        #TODO: log the failure and send to backend etc


#returns a mean of the values of the sensorstation
async def get_sensor_data_averages(sensorstation_id):
    try:
        averages_query = db_conn.execute(
            f'''SELECT AVG(temperature) AS temp_avg, AVG(humidity) AS humidity_avg,
            AVG(air_pressure) AS air_pressure_avg, AVG(illuminance) AS illuminance_avg,
            AVG(air_quality_index) AS air_quality_index_avg, AVG(soil_moisture) AS soil_moisture_avg
            FROM sensordata
            WHERE id = ?''',
            (sensorstation_id,)
        )
        
        return dict(averages_query.fetchone())
    except:
        print("database cant be accessed") #TODO: Implement logging


async def clear_sensor_data(sensorstation_id):
    try:
        db_conn.execute(
            '''DELETE FROM sensordata
            WHERE id = ?''',
            (sensorstation_id,)
        )
    except:
        pass
        #TODO: Logging implementation 

     
     

#returns a dictionary of the thresholds of the sensorstation
async def get_sensor_data_thresholds(sensorstation_id):
    try:
        thresholds_query = db_conn.execute(
            f'''SELECT temperature_max, humidity_max, air_pressure_max, 
                illuminance_max, air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, 
                illuminance_min, air_quality_index_min, soil_moisture_min
                FROM sensorstations
                WHERE id = ?''',
            (sensorstation_id)
        )
        return dict(thresholds_query.fetchone())

    except:
        print("database cant be accessed") #TODO: implement log

async def get_sensorstation_transmissioninterval(sensorstation_id):
    try:
        result = db_conn.execute("SELECT transmissioninterval FROM sensorstations WHERE id = ?", (sensorstation_id,))
        transmission_interval = result.fetchone()[0]
        return transmission_interval
    except Exception as e:
            db_conn.rollback()
            print(f"Error fetching data for sensorstation {sensorstation_id}: {e}")

async def initialize_sensorstation(sensorstation_id):        
    json_data = {
            'id': sensorstation_id,

            'transmission_interval': common.default_transmission_interval,
            'accessPoint': common.access_point_name,
            'lowerBound': {
                'airPressure': 0,
                'airQuality': 0,
                'humidity': 0,
                'lightIntensity': 0,
                'soilMoisture': 0,
                'temperature': 0
            },
            'upperBound': {
                'airPressure': 1000000,  
                'airQuality': 1000000,
                'humidity': 1000000,
                'lightIntensity': 1000000,
                'soilMoisture': 1000000,
                'temperature': 1000000
            }
        }
    await update_sensorstation(json.dumps(json_data))

async def update_sensorstation(json_data):
    sensorstation = json.loads(json_data)

    with db_conn:
        try:

            sensorstation_id = sensorstation['id']
            transmission_interval = sensorstation['transmission_interval']

            upper_bounds = sensorstation['upperBound']
            temperature_max = upper_bounds['temperature']
            humidity_max = upper_bounds['humidity']
            air_pressure_max = upper_bounds['airPressure']
            illuminance_max = upper_bounds['lightIntensity']
            air_quality_index_max = upper_bounds['airQuality']
            soil_moisture_max = upper_bounds['soilMoisture']

            lower_bounds = sensorstation['lowerBound']
            temperature_min = lower_bounds['temperature']
            humidity_min = lower_bounds['humidity']
            air_pressure_min = lower_bounds['airPressure']
            illuminance_min = lower_bounds['lightIntensity']
            air_quality_index_min = lower_bounds['airQuality']
            soil_moisture_min = lower_bounds['soilMoisture']
            db_conn.execute(
                '''INSERT OR REPLACE INTO sensorstations
                (id, transmissioninterval,
                temperature_max, humidity_max, air_pressure_max, illuminance_max,
                air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, illuminance_min,
                air_quality_index_min, soil_moisture_min)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (sensorstation_id, transmission_interval,
                temperature_max, humidity_max, air_pressure_max, illuminance_max,
                air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, illuminance_min,
                air_quality_index_min, soil_moisture_min))
        except Exception as e:
            db_conn.rollback()
            print(f"Error inserting data for sensorstation {sensorstation_id}: {e}")
