#ifndef _BLE_SV_SENSWARN_H
#define _BLE_SV_SENSWARN_H

#include "ble.h"

// UUIDs for sensor warnings service (not part of BLE spec)
#define BLE_UUID_SENSOR_WARNINGS    "ff00"
#define BLE_UUID_WARN_AIR_PRESSURE  "ff01"
#define BLE_UUID_WARN_TEMPERATURE   "ff02"
#define BLE_UUID_WARN_HUMIDITY      "ff03"
#define BLE_UUID_WARN_ILLUMINANCE   "ff04"
#define BLE_UUID_WARN_AIR_QUALITY   "ff05"
#define BLE_UUID_WARN_SOIL_MOISTURE "ff06"
#define BLE_UUID_WARN_ANY_ACTIVE    "ff80"

#define BUTTON_ID_CLEAR_WARNING 1

namespace ble {
  void senswarn_setup();
  void senswarn_update();
} // namespace ble

#endif
