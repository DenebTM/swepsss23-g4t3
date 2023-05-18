import time
import json
from db import db_conn
import common

current_time = int(time.time())
five_min_ago = current_time - 300

async def save_sensor_values_to_database(sensorstation_id, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture):
    try:
        db_conn.execute('INSERT INTO sensordata (ssID, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        (sensorstation_id, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture, int(time.time())))
        db_conn.commit()
    except Exception as e:
        print(e)
        #TODO: log the failure and send to backend etc

#returns a mean of the values of the sensorstation
async def get_sensor_data_averages(sensorstation_id):
    try:
        cursor = db_conn.cursor()
        cursor.execute(
            f'''SELECT AVG(temperature) AS temp_avg, AVG(humidity) AS humidity_avg,
            AVG(air_pressure) AS air_pressure_avg, AVG(illuminance) AS illuminance_avg,
            AVG(air_quality_index) AS air_quality_index_avg, AVG(soil_moisture) AS soil_moisture_avg
            FROM sensordata
            WHERE ssID = ?''',
            (sensorstation_id,)
        )
        results = cursor.fetchone()

        averages_dict = {
            'temperature': results[0],
            'humidity': results[1] / 100,
            'airPressure': results[2],
            'lightIntensity': results[3],
            'airQuality': results[4],
            'soilMoisture': results[5]
        }
        cursor.close()

        return averages_dict
    except Exception as e:
        print('Database access error:', e)
        # TODO: Implement logging

async def clear_sensor_data(sensorstation_id):
    try:
        db_conn.execute(
            '''DELETE FROM sensordata
            WHERE ssID = ?''',
            (sensorstation_id,)
        )
        db_conn.commit()
    except Exception as e:
        print(f'couldnt delete sensordata. Error: {e}')
        #TODO: Logging implementation 

async def get_sensorstation_thresholds(sensorstation_id):
    try:
        cursor = db_conn.cursor()
        cursor.execute(
            f'''SELECT temperature_max, humidity_max, airPressure_max, 
                lightIntensity_max, airQuality_max, soilMoisture_max,
                temperature_min, humidity_min, airPressure_min, 
                lightIntensity_min, airQuality_min, soilMoisture_min
                FROM sensorstations
                WHERE ssID = ?''',
            (sensorstation_id,)
        )
        thresholds_query = cursor.fetchone()
        cursor.close()
        if thresholds_query:
            thresholds_dict = {
                'temperature_max': thresholds_query[0],
                'humidity_max': thresholds_query[1],
                'airPressure_max': thresholds_query[2],
                'lightIntensity_max': thresholds_query[3],
                'airQuality_max': thresholds_query[4],
                'soilMoisture_max': thresholds_query[5],
                'temperature_min': thresholds_query[6],
                'humidity_min': thresholds_query[7],
                'airPressure_min': thresholds_query[8],
                'lightIntensity_min': thresholds_query[9],
                'airQuality_min': thresholds_query[10],
                'soilMoisture_min': thresholds_query[11]
            }
            return thresholds_dict
        else:
            return {}
    except Exception as e:
        print('Database access error:', e)
        # TODO: Implement logging
        return {}

async def get_sensorstation_aggregation_period(sensorstation_id):
    try:
        cursor = db_conn.cursor()
        cursor.execute('SELECT aggregation_period FROM sensorstations WHERE ssID = ?', (sensorstation_id,))
        aggregation_period = cursor.fetchone()[0]
        return aggregation_period
    except Exception as e:
            db_conn.rollback()
            print(f'Error fetching data for sensorstation {sensorstation_id}: {e}')

async def initialize_sensorstation(sensorstation_id):        
    json_data = {
        'ssID': sensorstation_id,

        'aggregationPeriod': common.default_aggregation_period,
        'apName': common.access_point_name,
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
    await update_sensorstation(json_data)

async def delete_sensorstation(sensorstation_id):
    try:
        db_conn.execute(
            '''DELETE FROM sensorstations
            WHERE id = ?''',
            (sensorstation_id,)
        )
        db_conn.commit()
    except Exception as e:
        #TODO: log this
        db_conn.rollback()
        print(f'couldnt delete sensorstation. Error:{e}')


async def update_sensorstation(sensorstation):
    with db_conn:
        try:
            sensorstation_id = sensorstation['ssID']
            aggregation_period = sensorstation['aggregationPeriod']

            thresholds = await get_sensorstation_thresholds(sensorstation_id)

            upper_bounds = sensorstation['upperBound']
            if upper_bounds is not None:
                thresholds['temperature_max'] = upper_bounds['temperature']
                thresholds['humidity_max'] = upper_bounds['humidity']
                thresholds['airPressure_max'] = upper_bounds['airPressure']
                thresholds['lightIntensity_max'] = upper_bounds['lightIntensity']
                thresholds['airQuality_max'] = upper_bounds['airQuality']
                thresholds['soilMoisture_max'] = upper_bounds['soilMoisture']

            lower_bounds = sensorstation['lowerBound']
            if lower_bounds is not None:
                thresholds['temperature_min'] = lower_bounds['temperature']
                thresholds['humidity_min'] = lower_bounds['humidity']
                thresholds['airPressure_min'] = lower_bounds['airPressure']
                thresholds['lightIntensity_min'] = lower_bounds['lightIntensity']
                thresholds['airQuality_min'] = lower_bounds['airQuality']
                thresholds['soilMoisture_min'] = lower_bounds['soilMoisture']

            db_conn.execute(
                '''INSERT OR REPLACE INTO sensorstations
                (ssID, aggregation_period,
                temperature_max, humidity_max, airPressure_max, lightIntensity_max,
                airQuality_max, soilMoisture_max,
                temperature_min, humidity_min, airPressure_min, lightIntensity_min,
                airQuality_min, soilMoisture_min)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (sensorstation_id, aggregation_period,

                thresholds['temperature_max'], thresholds['humidity_max'],
                thresholds['airPressure_max'], thresholds['lightIntensity_max'],
                thresholds['airQuality_max'], thresholds['soilMoisture_max'],

                thresholds['temperature_min'], thresholds['humidity_min'],
                thresholds['airPressure_min'], thresholds['lightIntensity_min'],
                thresholds['airQuality_min'], thresholds['soilMoisture_min']))
            db_conn.commit()
        except Exception as e:
            db_conn.rollback()
            print(f'Error inserting data for sensorstation {sensorstation_id}: {e}')
