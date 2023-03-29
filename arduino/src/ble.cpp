#include <ble.h>
#include <station_id.h>

// Device information
BLEService ble_sv_devinfo("180a");
BLEStringCharacteristic ble_ch_manufacturer("2a29", BLERead, strlen(BLE_DEVICE_MANUFACTURER));

// Services
BLEService ble_sv_heartbeat("f000");

// Characteristics
BLEByteCharacteristic ble_ch_stationID("f001", BLERead | BLENotify);

uint8_t ble_val_stationID = 0;

void ble_connect_handler(BLEDevice central) {
  // central connected event handler
  Serial.print("Connected to central: ");
  Serial.println(central.address());
}

void ble_disconnect_handler(BLEDevice central) {
  // central disconnected event handler
  Serial.print("Disconnected from central");
}

void ble_devinfo_setup() {
  BLE.setAppearance(BLE_DEVICE_APPEARANCE);
  BLE.setDeviceName(BLE_DEVICE_NAME);
  BLE.setLocalName(BLE_DEVICE_NAME);

  ble_ch_manufacturer.writeValue(BLE_DEVICE_MANUFACTURER);
  ble_sv_devinfo.addCharacteristic(ble_ch_manufacturer);
  BLE.addService(ble_sv_devinfo);

  ble_val_stationID = station_id();
  ble_ch_stationID.writeValue(ble_val_stationID);
  BLE.setAdvertisedService(ble_sv_heartbeat);
  BLE.setAdvertisedServiceData(0xf000, &ble_val_stationID, 1);
}


int ble_setup() {
  if (!BLE.begin()) {
    Serial.println("Error initializing BLE!");
  }

  ble_devinfo_setup();

  ble_sv_heartbeat.addCharacteristic(ble_ch_stationID);
  BLE.addService(ble_sv_heartbeat);

  BLE.setEventHandler(BLEConnected, ble_connect_handler);
  BLE.setEventHandler(BLEDisconnected, ble_disconnect_handler);

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

unsigned long last_timestamp = 0;
void ble_update() {
  BLE.poll();

  unsigned long new_timestamp = millis();
  if (new_timestamp - last_timestamp >= 1000) {
    if (BLE.central().connected()) {
      uint8_t id = station_id();

      if (id != ble_val_stationID) {
        Serial.println("Station ID changed");
        ble_val_stationID = id;
        ble_ch_stationID.writeValue(ble_val_stationID);
      }
      Serial.print("Current station ID: ");
      Serial.println((unsigned long)ble_val_stationID);
    }

    last_timestamp = new_timestamp;
  }
}
