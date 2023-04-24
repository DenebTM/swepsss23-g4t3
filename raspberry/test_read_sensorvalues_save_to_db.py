import unittest
from unittest.mock import MagicMock, patch, AsyncMock
import asyncio

from read_sensor_and_save_to_db import read_and_send_sensorvalues
from databaseOperations import saveSensorValuesToDatabase

class TestMyModule(unittest.IsolatedAsyncioTestCase):

    @patch('read_sensor_and_save_to_db.BleakClient', autospec=True)
    async def test_read_and_send_sensorvalues(self, mock_client):
        mock_sensorstation = MagicMock()
        mock_temperature = MagicMock()
        mock_humidity = MagicMock()
        mock_air_pressure = MagicMock()
        mock_illuminance = MagicMock()
        mock_air_quality_index = MagicMock()
        mock_soil_moisture = MagicMock()
        
        # set up values to be returned by read_gatt_char method
        mock_client.read_gatt_char = AsyncMock(side_effect=[
            mock_temperature.to_bytes(),
            mock_humidity.to_bytes(),
            mock_air_pressure.to_bytes(),
            mock_illuminance.to_bytes(),
            mock_air_quality_index.to_bytes(),
            mock_soil_moisture.to_bytes(),
        ])

        
        # call the function and cancel cause forever loop and shit
        task = asyncio.create_task(read_and_send_sensorvalues(mock_sensorstation))
        task.cancel

        # assert that saveSensorValuesToDatabase was called with expected arguments
        await saveSensorValuesToDatabase.assert_called_once_with(
            mock_sensorstation.name,
            mock_temperature,
            mock_humidity,
            mock_air_pressure,
            mock_illuminance,
            mock_air_quality_index,
            mock_soil_moisture,
        )

if __name__ == '__main__':
    asyncio.run(unittest.main())