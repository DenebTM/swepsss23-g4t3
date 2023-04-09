#ifndef _BLE_SV_DEVINFO_H
#define _BLE_SV_DEVINFO_H

#include "ble.h"

// UUIDs for device information service
#define BLE_UUID_DEVINFO              "180a"
#define BLE_UUID_MANUFACTURER_NAME    "2a29"
#define BLE_UUID_STATION_ID           "f001"  // not part of BLE Device Information spec

namespace ble {
  extern BLEService sv_devinfo;
  extern BLEStringCharacteristic ch_manufacturer;
  extern BLEByteCharacteristic ch_stationID;
  extern uint8_t val_stationID;

  void devinfo_setup();
}

#endif