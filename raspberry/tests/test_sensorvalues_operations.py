import unittest

from unittest.mock import AsyncMock, patch
from bleak import BleakError


from sensorvalues_operations import read_sensorvalues
from database_operations import save_sensor_values_to_database


class TestReadSensorValue(unittest.IsolatedAsyncioTestCase):

    @patch('database_operations.save_sensor_values_to_database')
    #@patch('sensorvalues_operations.BleakClient')
    async def test_read_sensorvalues(self, save_sensor_values_to_database):
        BleakClient = AsyncMock()
        #mock reading characteristic of BleakClient
        BleakClient.read_gatt_char.return_value=int(10).to_bytes(2,byteorder='little')

        # call function with mock client
        await read_sensorvalues(BleakClient, 1)

        # assert that saveSensorValuesToDatabase was called once with the expected arguments
        save_sensor_values_to_database.assert_called_once_with(1, 10, 10, 10, 10, 10, 10)

#TODO: implement test for logging when something is down
    # @patch('read_sensorvalues.BleakClient')
    # async def test_log_on_error(self, BleakClient):

    #     # call function with mock client
    #     BleakClient().__aenter__.return_value.read_gatt_char.side_effect=BleakError

    #     await read_sensorvalues(BleakClient)
