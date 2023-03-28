#include <ArduinoBLE.h>

#include <station_id.h>

BLEService heartbeatService("f000");
BLEByteCharacteristic stationID("f001", BLERead | BLEBroadcast);
uint8_t initial_id = station_id();

void setup() {
  Serial.begin(9600);
  while (!Serial);

  if (!BLE.begin()) {
    Serial.println("Error initializing BLE!");
  }

  heartbeatService.addCharacteristic(stationID);
  BLE.addService(heartbeatService);

  Serial.print("Own address: ");
  Serial.println(BLE.address());

  stationID.writeValue(initial_id);
  stationID.broadcast();
  BLE.setAdvertisedService(heartbeatService);
  BLE.setDeviceName("iPhone von S. Kurz");
  BLE.setLocalName("iPhone von S. Kurz");

  Serial.println("Beginning BLE advertising");
  if (!BLE.advertise()) {
    Serial.println("BLE advertising failed!");
  }
}

void loop() {
  int i = 0;
  if (BLEDevice central = BLE.central()) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());

    while (central.connected()) {
      Serial.println("Still connected");

      uint8_t id = station_id();
      Serial.println((unsigned long)id);
      stationID.writeValue(id);
      delay(1000);
    }
  }

  Serial.println("No connection...");
  delay(1000);
}
