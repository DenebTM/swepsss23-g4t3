import time
from db import db_conn

current_time = int(time.time())
five_min_ago = current_time - 300

async def saveSensorValuesToDatabase(sensorstationname, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture):
    try:
        db_conn.execute("INSERT INTO sensordata (sensorstation_name, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                        (sensorstationname, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture, int(time.time())))
        db_conn.commit()
    except:
        pass #TODO log the failure and send to backend etc


#returns a mean of the values of the last 5 minutes
async def get_sensor_data_averages(sensorstation):
        try:
            averages_query = db_conn.execute(
                f'''SELECT AVG(temperature) AS temp_avg, AVG(humidity) AS humidity_avg,
                AVG(air_pressure) AS air_pressure_avg, AVG(illuminance) AS illuminance_avg,
                AVG(air_quality_index) AS air_quality_index_avg, AVG(soil_moisture) AS soil_moisture_avg
                FROM sensordata
                WHERE sensorstationname = ?
                AND timestamp >= ?''',
                (sensorstation.name, five_min_ago)
                )
            
            return dict(averages_query.fetchone())
        except:
            print("database cant be accessed # log")

#returns a dictionary of the thresholds of the sensorstation
async def get_sensor_data_threshholds(sensorstation):
    try:
        thresholds_query = db_conn.execute(
            f'''SELECT temperature_max, humidity_max, air_pressure_max, 
                illuminance_max, air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, 
                illuminance_min, air_quality_index_min, soil_moisture_min
                FROM sensorstations
                WHERE sensorstationname = ?''',
            (sensorstation.name)
        )
        return dict(thresholds_query.fetchone())

    except:
        print("database cant be accesse #log")

         

