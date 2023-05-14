import unittest
import sqlite3
import json
from unittest.mock import MagicMock, patch
import time

#TODO: implement logging testing
from database_operations import save_sensor_values_to_database, get_sensor_data_averages, get_sensor_data_thresholds, update_sensorstation, get_sensorstation_transmissioninterval

class TestDatabaseOperations(unittest.IsolatedAsyncioTestCase):

    @patch('database_operations.db_conn')
    async def test_save_sensor_values_to_database(self, db_conn):

        # Call the function with test input
        await save_sensor_values_to_database(123, 10, 20, 30, 40, 50, 60)

        # Assert that the mock database connection was called with the correct SQL query and parameters
        db_conn.execute.assert_called_once_with('INSERT INTO sensordata (id, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        (123, 10, 20, 30, 40, 50, 60, int(time.time())))
        db_conn.commit.assert_called_once()


    # Test get_sensor_data_averages function
    @patch('database_operations.db_conn')
    async def test_get_sensor_data_averages(self, db_conn):
        cursor = MagicMock()
        db_conn.cursor.return_value = cursor
        cursor.fetchone.return_value = (10, 20, 30, 40, 50, 60)

        # Define the expected results
        expected_results = {
            'temperature': 10,
            'humidity': 20,
            'air_pressure': 30,
            'illuminance': 40,
            'air_quality_index': 50,
            'soil_moisture': 60
        }

        # Call the function with the mocked parameters
        result = await get_sensor_data_averages(1)

        # Check the results against the expected results
        self.assertEqual(result, expected_results)



    @patch('database_operations.db_conn')
    async def test_get_sensorstation_transmissioninterval(self, db_conn):
        cursor = MagicMock()
        db_conn.cursor.return_value = cursor
        cursor.fetchone.return_value = (300,)  # transmission interval of 300 seconds
       
        # Call the function with a mock sensorstation_id
        transmission_interval = await get_sensorstation_transmissioninterval(1)
        # Check that the function returned the expected value
        self.assertEqual(transmission_interval, 300)


    # Test get_sensor_data_thresholds function
    @patch('database_operations.db_conn')
    async def test_get_sensor_data_thresholds(self, db_conn):

        # Mock the database connection and cursor and the query
        cursor = MagicMock()
        db_conn.cursor.return_value = cursor
        cursor.fetchone.return_value = (100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0)

        # Define the expected results
        expected_results = {
            'temperature_max': 100,
            'humidity_max': 100,
            'air_pressure_max': 100,
            'illuminance_max': 100,
            'air_quality_index_max': 100,
            'soil_moisture_max': 100,
            'temperature_min': 0,
            'humidity_min': 0,
            'air_pressure_min': 0,
            'illuminance_min': 0,
            'air_quality_index_min': 0,
            'soil_moisture_min': 0
        }


        # Call the function with the mocked parameters
        result = await get_sensor_data_thresholds(1)

        # Check the results against the expected results
        self.assertEqual(result, expected_results)

    @patch('database_operations.db_conn')
    async def test_update_sensorstation(self, db_conn):

        #set up json which is received 
        json_data = {
            'id': 123,
            'status': 'OK',
            'gardeners':[
                'user1',
                'user2'
            ],
            'transmission_interval': 500,
            'accessPoint': 'AccessPoint1',
            'lowerBound': {
                'airPressure': 0,
                'airQuality': 0,
                'humidity': 0,
                'lightIntensity': 0,
                'soilMoisture': 0,
                'temperature': 0
            },
            'upperBound': {
                'airPressure': 20,  
                'airQuality': 20,
                'humidity': 20,
                'lightIntensity': 20,
                'soilMoisture': 20,
                'temperature': 20
            }
        }
        
        await update_sensorstation(json.dumps(json_data))

        # check if the data is inserted correctly
        db_conn.execute.assert_called_once_with(
                '''INSERT OR REPLACE INTO sensorstations
                (id, transmissioninterval,
                temperature_max, humidity_max, air_pressure_max, illuminance_max,
                air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, illuminance_min,
                air_quality_index_min, soil_moisture_min)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (123, 500, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0))
