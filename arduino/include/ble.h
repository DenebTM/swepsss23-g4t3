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

#define BLE_UUID_DEVINFO              "180a"
#define BLE_UUID_MANUFACTURER_NAME    "2a29"
#define BLE_UUID_STATION_ID           "f001"  // not part of the BLE spec

namespace ble {
  static String paired_mac = BLE_NO_PAIRED_DEVICE;

  int setup();
  void update();
}

#endif
