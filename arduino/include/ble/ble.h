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

// time between each BLE sensor data update
#define BLE_TRANSMIT_INTERVAL_MS      3000

namespace ble {
  static String paired_mac = BLE_NO_PAIRED_DEVICE;

  int setup();
  void update();
}

#endif
