#include <ble.h>
#include <station_id.h>

namespace ble {
  // Device information
  BLEService sv_devinfo("180a");
  BLEStringCharacteristic ch_manufacturer("2a29", BLERead, strlen(BLE_DEVICE_MANUFACTURER));

  // Services
  // [to be added]

  // Characteristics
  BLEByteCharacteristic ch_stationID("f001", BLERead | BLENotify);

  uint8_t val_stationID = 0;
  unsigned long update_last_timestamp = 0;

  void devinfo_setup() {
    BLE.setAppearance(BLE_DEVICE_APPEARANCE);
    BLE.setDeviceName(BLE_DEVICE_NAME);
    BLE.setLocalName(BLE_DEVICE_NAME);

    ble::ch_manufacturer.writeValue(BLE_DEVICE_MANUFACTURER);
    ble::sv_devinfo.addCharacteristic(ble::ch_manufacturer);

    ble::val_stationID = station_id();
    ble::ch_stationID.writeValue(ble::val_stationID);
    ble::sv_devinfo.addCharacteristic(ble::ch_stationID);

    BLE.addService(ble::sv_devinfo);

    BLE.setAdvertisedService(ble::sv_devinfo);
    BLE.setAdvertisedServiceData(0x180a, &ble::val_stationID, 1);
  }

  void connect_handler(BLEDevice central) {
    Serial.print("Connected to central: ");
    Serial.println(central.address());
  }

  void disconnect_handler(BLEDevice central) {
    Serial.println("Disconnected from central");
  }
}


int ble::setup() {
  if (!BLE.begin()) {
    Serial.println("Error initializing BLE!");
  }

  ble::devinfo_setup();

  BLE.setEventHandler(BLEConnected, ble::connect_handler);
  BLE.setEventHandler(BLEDisconnected, ble::disconnect_handler);

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

void ble::update() {
  BLE.poll();

  unsigned long new_timestamp = millis();
  if (new_timestamp - ble::update_last_timestamp >= 1000) {
    if (BLE.central().connected()) {
      uint8_t id = station_id();

      if (id != ble::val_stationID) {
        Serial.println("Station ID changed");
        ble::val_stationID = id;
        ble::ch_stationID.writeValue(ble::val_stationID);
      }
      Serial.print("Current station ID: ");
      Serial.println((unsigned long)ble::val_stationID);
    }

    ble::update_last_timestamp = new_timestamp;
  }
}
