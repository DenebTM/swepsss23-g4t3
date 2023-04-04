#ifndef _BLE_H
#define _BLE_H

#include <cstddef>
#include <Arduino.h>
#include <ArduinoBLE.h>

#define BLE_DEVICE_NAME               "PH SensorStation"
#define BLE_DEVICE_MANUFACTURER       "UIBK SE G4T3"
#define BLE_DEVICE_APPEARANCE         0x3621

#define BLE_NO_PAIRED_DEVICE          String("")
#define BLE_PAIRING_MODE_TIMEOUT_MSEC 30000

// UUIDs for device information service
#define BLE_UUID_DEVINFO              "180a"
#define BLE_UUID_MANUFACTURER_NAME    "2a29"
#define BLE_UUID_STATION_ID           "f001"  // not part of the BLE spec

// UUIDs for environmental sensing service
#define BLE_UUID_ESS                  "181a"
#define BLE_UUID_AIR_PRESSURE         "2a6d"

// time between each BLE sensor data update
#define BLE_TRANSMIT_INTERVAL_MS      10000

namespace ble {
  static String paired_mac = BLE_NO_PAIRED_DEVICE;

  int setup();
  void update();
}

#endif
