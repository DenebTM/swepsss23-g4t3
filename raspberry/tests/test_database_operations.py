import unittest
import json
from unittest.mock import MagicMock, patch
import time

#TODO: implement logging testing

from database_operations import saveSensorValuesToDatabase, get_sensor_data_averages, get_sensor_data_threshholds, update_sensorstation

class TestDatabaseOperations(unittest.IsolatedAsyncioTestCase):
    
    @patch('database_operations.db_conn')
    async def test_saveSensorValuesToDatabase(self, db_conn):

        # Call the function with test input
        await saveSensorValuesToDatabase("station1", 10, 20, 30, 40, 50, 60)

        # Assert that the mock database connection was called with the correct SQL query and parameters
        db_conn.execute.assert_called_once_with("INSERT INTO sensordata (sensorstation_name, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                        ("station1", 10, 20, 30, 40, 50, 60, int(time.time())))
        db_conn.commit.assert_called_once()


    # Test get_sensor_data_averages function
    @patch('database_operations.db_conn')
    async def test_get_sensor_data_averages(self, db_conn):

        # Set up the mock database connection to return some test data
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = {'temp_avg': 10, 'humidity_avg': 20, 'air_pressure_avg': 30, 'illuminance_avg': 40, 'air_quality_index_avg': 50, 'soil_moisture_avg': 60}
        db_conn.execute.return_value = mock_cursor

        mock_Sensorstation = MagicMock()
        mock_Sensorstation.name.return_value = "station1"

        # Call the function with test input
        result = await get_sensor_data_averages(mock_Sensorstation)

        # Assert that the function returned the correct result
        self.assertEqual(result, {"temp_avg": 10, "humidity_avg": 20, "air_pressure_avg": 30, "illuminance_avg": 40, "air_quality_index_avg": 50, "soil_moisture_avg": 60})

    # Test get_sensor_data_threshholds function
    @patch('database_operations.db_conn')
    async def test_get_sensor_data_threshholds(self, db_conn):

        # Set up the mock database connection to return some test data
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = {"temperature_max": 10, "humidity_max": 20, "air_pressure_max": 30, "illuminance_max": 40, "air_quality_index_max": 50, "soil_moisture_max": 60,
                                  "temperature_min": 70, "humidity_min": 80, "air_pressure_min": 90, "illuminance_min": 100, "air_quality_index_min": 100, "soil_moisture_min": 120}
        
        db_conn.execute.return_value = mock_cursor

        mock_Sensorstation = MagicMock()
        mock_Sensorstation.name.return_value = "station1"

        # Call the function with test input
        result = await get_sensor_data_threshholds(mock_Sensorstation)

        # Assert that the function returned the correct result
        self.assertEqual(result, {"temperature_max": 10, "humidity_max": 20, "air_pressure_max": 30, "illuminance_max": 40, "air_quality_index_max": 50, "soil_moisture_max": 60,
                                  "temperature_min": 70, "humidity_min": 80, "air_pressure_min": 90, "illuminance_min": 100, "air_quality_index_min": 100, "soil_moisture_min": 120})
    
    @patch('database_operations.db_conn')
    async def test_update_sensorstation(self, db_conn):

        #set up json which is received 
        json_data = '''{
            "name": "station1",
            "transmissioninterval": 60,
            "thresholds": {
                "temperature_max": 25,
                "temperature_min": 10,
                "humidity_max": 80,
                "humidity_min": 30,
                "air_pressure_max": 1000,
                "air_pressure_min": 900,
                "illuminance_max": 1000,
                "illuminance_min": 100,
                "air_quality_index_max": 50,
                "air_quality_index_min": 0,
                "soil_moisture_max": 50,
                "soil_moisture_min": 10
            }
        }'''
        
        await update_sensorstation(json_data)

        # check if the data is inserted correctly
        db_conn.execute.assert_called_once_with(
                '''INSERT OR REPLACE INTO sensorstations
                (sensorstationname, transmissioninterval,
                temperature_max, humidity_max, air_pressure_max, illuminance_max,
                air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, illuminance_min,
                air_quality_index_min, soil_moisture_min)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                ("station1", 60, 25, 80, 1000, 1000, 50, 50, 10, 30, 900, 100, 0, 10))
