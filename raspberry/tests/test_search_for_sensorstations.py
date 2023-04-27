import unittest
from unittest.mock import AsyncMock, patch
import asyncio
import common

from search_for_sensorstations import search_for_sensorstations


class test_search_for_sensorstations(unittest.IsolatedAsyncioTestCase):

    @patch('search_for_sensorstations.BleakScanner')
    async def test_search_for_sensorstations(self, BleakScanner):

        # Set up mock devices
        mock_device_1 = AsyncMock()
        mock_device_1.name = common.sensor_station_name + "1"
        mock_device_2 = AsyncMock()
        mock_device_2.name = common.sensor_station_name + "2"
        mock_device_3 = AsyncMock()
        mock_device_3.name = 'other_device'

        mock_devices = asyncio.create_task(asyncio.sleep(0, result=[mock_device_1, mock_device_2, mock_device_3]))

        # Set up the mock discover method to return the mock devices
        BleakScanner.discover.return_value = mock_devices

        # Call the function being tested
        sensorstations = await search_for_sensorstations()

        # Check that the mock discover method was called
        BleakScanner.discover.assert_called_once()

        # Check that the function returns the correct list of sensor stations
        self.assertEqual(sensorstations, [mock_device_1, mock_device_2])

