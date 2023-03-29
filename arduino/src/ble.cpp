#include <ble.h>
#include <station_id.h>

// Services
BLEService ble_sv_heartbeat("f000");

// Characteristics
BLEByteCharacteristic ble_ch_stationID("f001", BLERead | BLEBroadcast);


BLEDevice central;
uint8_t ble_val_stationID = 0;

int ble_setup() {
  if (!BLE.begin()) {
    Serial.println("Error initializing BLE!");
  }

  ble_sv_heartbeat.addCharacteristic(ble_ch_stationID);
  BLE.addService(ble_sv_heartbeat);

  ble_val_stationID = station_id();
  ble_ch_stationID.writeValue(ble_val_stationID);
  ble_ch_stationID.broadcast();
  BLE.setAdvertisedService(ble_sv_heartbeat);
  BLE.setDeviceName(BLE_DEVICE_NAME);
  BLE.setLocalName(BLE_DEVICE_NAME);

  Serial.println("Beginning BLE advertising");
  if (!BLE.advertise()) {
    Serial.println("BLE advertising failed!");
    return -1;
  } else {
    Serial.print("Own address: ");
    Serial.println(BLE.address());
  }

  return 0;
}

void ble_update() {
  if (!central && (central = BLE.central())) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());

  }

  if (central && central.connected()) {
    Serial.println("Still connected");

    uint8_t id = station_id();

    if (id != ble_val_stationID) {
      Serial.println("Station ID changed");
      ble_val_stationID = id;
    }
    Serial.print("Current station ID: ");
    Serial.println((unsigned long)ble_val_stationID);

    ble_ch_stationID.writeValue(ble_val_stationID);
  }
  else {
    Serial.println("No connection...");
  }
}