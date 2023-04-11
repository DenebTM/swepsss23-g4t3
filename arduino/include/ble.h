#ifndef _BLE_H
#define _BLE_H

#include <cstddef>
#include <Arduino.h>
#include <ArduinoBLE.h>

#define BLE_DEVICE_NAME               "PH SensorStation"
#define BLE_DEVICE_MANUFACTURER       "UIBK SE G4T3"
#define BLE_DEVICE_APPEARANCE         0x3621

#define BLE_NO_PAIRED_DEVICE          String("")
#define BLE_PAIRING_MODE_TIMEOUT_MS   30000

// UUIDs for device information service
#define BLE_UUID_DEVINFO              "180a"
#define BLE_UUID_MANUFACTURER_NAME    "2a29"
#define BLE_UUID_STATION_ID           "f001"  // not part of BLE Device Information spec

// UUIDs for environmental sensing service
#define BLE_UUID_ESS                  "181a"
#define BLE_UUID_AIR_PRESSURE         "2a6d"
#define BLE_UUID_TEMPERATURE          "2a6e"
#define BLE_UUID_HUMIDITY             "2a6f"
#define BLE_UUID_ILLUMINANCE          "2afb"
#define BLE_UUID_AIR_QUALITY          "f105"  // not part of BLE Environmental Sensing spec
#define BLE_UUID_SOIL_MOISTURE        "f106"  // not part of BLE Environmental Sensing spec

// time between each BLE sensor data update
#define BLE_TRANSMIT_INTERVAL_MS      3000

namespace ble {
  static String paired_mac = BLE_NO_PAIRED_DEVICE;

  int setup();
  void update();
}

#endif
