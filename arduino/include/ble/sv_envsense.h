#ifndef _BLE_SV_ENVSENSE_H
#define _BLE_SV_ENVSENSE_H

#include "ble.h"

using namespace std::chrono_literals;

// UUIDs for environmental sensing service
#define BLE_UUID_ESS           "181a"
#define BLE_UUID_AIR_PRESSURE  "2a6d"
#define BLE_UUID_TEMPERATURE   "2a6e"
#define BLE_UUID_HUMIDITY      "2a6f"
#define BLE_UUID_ILLUMINANCE   "2afb"
#define BLE_UUID_AIR_QUALITY   "f105" // not part of BLE spec
#define BLE_UUID_SOIL_MOISTURE "f106" // not part of BLE spec

// time between each BLE sensor data update
#define BLE_ENVSENSE_TRANSMIT_INTERVAL 3s

namespace ble {
  void envsense_setup();
  void envsense_update();
} // namespace ble

#endif
