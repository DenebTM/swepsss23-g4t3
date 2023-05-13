import unittest
import sqlite3
import json
from unittest.mock import MagicMock, patch
import time

#TODO: implement logging testing
from database_operations import save_sensor_values_to_database, get_sensor_data_averages, get_sensor_data_thresholds, update_sensorstation, get_sensorstation_transmissioninterval

SENSORSTATION_ID = 1
TRANSMISSION_INTERVAL = 300
MOCK_VALUES_TUPLE = (10,20,30,40,50,60)
MOCK_THRESHOLDS_TUPLE = (100,100,100,100,100,100,0,0,0,0,0,0)

class TestDatabaseOperations(unittest.IsolatedAsyncioTestCase):

    @patch('database_operations.db_conn')
    async def test_save_sensor_values_to_database(self, db_conn):
        # Call the function with test input
        await save_sensor_values_to_database(SENSORSTATION_ID, MOCK_VALUES_TUPLE[0], MOCK_VALUES_TUPLE[1], MOCK_VALUES_TUPLE[2], MOCK_VALUES_TUPLE[3], MOCK_VALUES_TUPLE[4], MOCK_VALUES_TUPLE[5])

        # Assert that the mock database connection was called with the correct SQL query and parameters
        db_conn.execute.assert_called_once_with('INSERT INTO sensordata (id, temperature, humidity, air_pressure, illuminance, air_quality_index, soil_moisture, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                        (SENSORSTATION_ID, MOCK_VALUES_TUPLE[0], MOCK_VALUES_TUPLE[1], MOCK_VALUES_TUPLE[2], MOCK_VALUES_TUPLE[3], MOCK_VALUES_TUPLE[4], MOCK_VALUES_TUPLE[5], int(time.time())))
        db_conn.commit.assert_called_once()

    # Test get_sensor_data_averages function
    @patch('database_operations.db_conn')
    async def test_get_sensor_data_averages(self, db_conn):
        cursor = MagicMock()
        db_conn.cursor.return_value = cursor
        cursor.fetchone.return_value = MOCK_VALUES_TUPLE

        # Define the expected results
        expected_results = {
            'temperature': MOCK_VALUES_TUPLE[0],
            'humidity': MOCK_VALUES_TUPLE[1],
            'air_pressure': MOCK_VALUES_TUPLE[2],
            'illuminance': MOCK_VALUES_TUPLE[3],
            'air_quality_index': MOCK_VALUES_TUPLE[4],
            'soil_moisture': MOCK_VALUES_TUPLE[5]
        }
        # Call the function with the mocked parameters
        result = await get_sensor_data_averages(SENSORSTATION_ID)

        # Check the results against the expected results
        self.assertEqual(result, expected_results)

    @patch('database_operations.db_conn')
    async def test_get_sensorstation_transmissioninterval(self, db_conn):
        cursor = MagicMock()
        db_conn.cursor.return_value = cursor
        cursor.fetchone.return_value = (TRANSMISSION_INTERVAL,)
       
        # Call the function with a mock sensorstation_id
        transmission_interval = await get_sensorstation_transmissioninterval(SENSORSTATION_ID)
        # Check that the function returned the expected value
        self.assertEqual(transmission_interval, TRANSMISSION_INTERVAL)

    # Test get_sensor_data_thresholds function
    @patch('database_operations.db_conn')
    async def test_get_sensor_data_thresholds(self, db_conn):

        # Mock the database connection and cursor and the query
        cursor = MagicMock()
        db_conn.cursor.return_value = cursor
        cursor.fetchone.return_value = MOCK_THRESHOLDS_TUPLE

        # Define the expected results
        expected_results = {
            'temperature_max': MOCK_THRESHOLDS_TUPLE[0],
            'humidity_max': MOCK_THRESHOLDS_TUPLE[1],
            'air_pressure_max': MOCK_THRESHOLDS_TUPLE[2],
            'illuminance_max': MOCK_THRESHOLDS_TUPLE[3],
            'air_quality_index_max': MOCK_THRESHOLDS_TUPLE[4],
            'soil_moisture_max': MOCK_THRESHOLDS_TUPLE[5],
            'temperature_min': MOCK_THRESHOLDS_TUPLE[6],
            'humidity_min': MOCK_THRESHOLDS_TUPLE[7],
            'air_pressure_min': MOCK_THRESHOLDS_TUPLE[8],
            'illuminance_min': MOCK_THRESHOLDS_TUPLE[9],
            'air_quality_index_min': MOCK_THRESHOLDS_TUPLE[10],
            'soil_moisture_min': MOCK_THRESHOLDS_TUPLE[11]
        }

        # Call the function with the mocked parameters
        result = await get_sensor_data_thresholds(SENSORSTATION_ID)

        # Check the results against the expected results
        self.assertEqual(result, expected_results)

    @patch('database_operations.db_conn')
    async def test_update_sensorstation(self, db_conn):

        #set up json which is received 
        json_data = {
            'id': SENSORSTATION_ID,
            'status': 'OK',
            'gardeners':[
                'user1',
                'user2'
            ],
            'transmission_interval': TRANSMISSION_INTERVAL,
            'accessPoint': 'AccessPoint1',
            'lowerBound': {
                'airPressure': MOCK_THRESHOLDS_TUPLE[11],
                'airQuality': MOCK_THRESHOLDS_TUPLE[10],
                'humidity': MOCK_THRESHOLDS_TUPLE[9],
                'lightIntensity': MOCK_THRESHOLDS_TUPLE[8],
                'soilMoisture': MOCK_THRESHOLDS_TUPLE[7],
                'temperature': MOCK_THRESHOLDS_TUPLE[6]
            },
            'upperBound': {
                'airPressure': MOCK_THRESHOLDS_TUPLE[5],  
                'airQuality': MOCK_THRESHOLDS_TUPLE[4],
                'humidity': MOCK_THRESHOLDS_TUPLE[3],
                'lightIntensity': MOCK_THRESHOLDS_TUPLE[2],
                'soilMoisture': MOCK_THRESHOLDS_TUPLE[1],
                'temperature': MOCK_THRESHOLDS_TUPLE[0]
            }
        } 
        await update_sensorstation(json_data)

        # check if the data is inserted correctly
        db_conn.execute.assert_called_once_with(
                '''INSERT OR REPLACE INTO sensorstations
                (id, transmissioninterval,
                temperature_max, humidity_max, air_pressure_max, illuminance_max,
                air_quality_index_max, soil_moisture_max,
                temperature_min, humidity_min, air_pressure_min, illuminance_min,
                air_quality_index_min, soil_moisture_min)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (SENSORSTATION_ID, TRANSMISSION_INTERVAL, MOCK_THRESHOLDS_TUPLE[0], MOCK_THRESHOLDS_TUPLE[1], 
                 MOCK_THRESHOLDS_TUPLE[2], MOCK_THRESHOLDS_TUPLE[3], MOCK_THRESHOLDS_TUPLE[4], MOCK_THRESHOLDS_TUPLE[5], 
                 MOCK_THRESHOLDS_TUPLE[6], MOCK_THRESHOLDS_TUPLE[7], MOCK_THRESHOLDS_TUPLE[8], MOCK_THRESHOLDS_TUPLE[9], 
                 MOCK_THRESHOLDS_TUPLE[10], MOCK_THRESHOLDS_TUPLE[11]))
