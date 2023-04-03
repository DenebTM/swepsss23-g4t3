import asyncio
from bleak import BleakScanner, BleakClient
from bleak.exc import BleakError

sensor_station_name = "PH SensorStation" 
base_uuid = "0000{}-0000-1000-8000-00805f9b34fb"
temperature = base_uuid.format("2a6e")
humidity = base_uuid.format("2a6f")


async def run():
    try:
        device = None
        while device is None:
            devices = await BleakScanner.discover()
            for d in devices:
                if sensor_station_name in d.name:
                    device = d
                    break
            await asyncio.sleep(5)
        
        if device is not None:
            async with BleakClient(device.address) as client:
                while True:
                    
                    temperature = await client.read_gatt_char(temperature)
                    print(f"Temperature: {temperature}")

                    humidity = await client.read_gatt_char(humidity)
                    print(f"Humidity: {humidity}")
                    
                    await asyncio.sleep(30)
        else:
            print("No device found with name", sensor_station_name)
    except BleakError as e:
        print(f"Error: {e}")

asyncio.run(run())