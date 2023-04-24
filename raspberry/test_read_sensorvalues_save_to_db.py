import unittest
import asyncio
from unittest.mock import MagicMock, AsyncMock, patch

from read_sensorvalues import read_and_send_sensorvalues
from database_operations import saveSensorValuesToDatabase

class TestReadAndSendSensorValues(unittest.IsolatedAsyncioTestCase):

    async def test_read_and_send_sensorvalues(self):
        # create mock bleak client
        mock_client = AsyncMock()

        # define mocked values
        mock_temperature = 10
        mock_humidity = 20
        mock_air_pressure = 30
        mock_illuminance = 40
        mock_air_quality_index = 50
        mock_soil_moisture = 60
        
        # set up gatt char values
        mock_client.read_gatt_char.side_effect = [
            mock_temperature.to_bytes(2, byteorder='little'),
            mock_humidity.to_bytes(2, byteorder='little'),
            mock_air_pressure.to_bytes(2, byteorder='little'),
            mock_illuminance.to_bytes(2, byteorder='little'),
            mock_air_quality_index.to_bytes(2, byteorder='little'),
            mock_soil_moisture.to_bytes(2, byteorder='little')
        ]
        
        # create mock for saveSensorValuesToDatabase
        with patch('database_operations.saveSensorValuesToDatabase') as mock_save:

            await read_and_send_sensorvalues(mock_client)

            # assert that saveSensorValuesToDatabase was called once with the expected arguments
            mock_save.assert_called_once_with(
                mock_client.name, mock_temperature, mock_humidity, mock_air_pressure,
                mock_illuminance, mock_air_quality_index, mock_soil_moisture
            )
