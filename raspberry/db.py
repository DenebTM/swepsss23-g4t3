import sqlite3

db_conn = sqlite3.connect('sensorstations.db')

# create necessary tables on initialization
# triple quotation mark for multi line strings in python
db_conn.execute('''CREATE TABLE IF NOT EXISTS sensorstations
             (ssID INTEGER PRIMARY KEY UNIQUE,
              transmissioninterval INTEGER,
              temperature_max REAL,
              humidity_max REAL,
              air_pressure_max REAL,
              illuminance_max REAL,
              air_quality_index_max REAL,
              soil_moisture_max REAL,
              temperature_min REAL,
              humidity_min REAL,
              air_pressure_min REAL,
              illuminance_min REAL,
              air_quality_index_min REAL,
              soil_moisture_min REAL)''')

db_conn.execute('''CREATE TABLE IF NOT EXISTS sensordata
             (ssID INTEGER,
              temperature REAL,
              humidity REAL,
              air_pressure REAL,
              illuminance REAL,
              air_quality_index REAL,
              soil_moisture REAL,
              timestamp INTEGER)''')
