import unittest
from unittest.mock import MagicMock, patch
import time

#TODO: implement logging testing

from database_operations import saveSensorValuesToDatabase, get_sensor_data_averages, get_sensor_data_threshholds

class TestSensorFunctions(unittest.IsolatedAsyncioTestCase):
    
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