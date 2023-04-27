#ifndef _BLE_SV_DEVINFO_H
#define _BLE_SV_DEVINFO_H

#include "ble.h"

// UUIDs for device information service
#define BLE_UUID_DEVINFO           "180a"
#define BLE_UUID_MANUFACTURER_NAME "2a29"
#define BLE_UUID_STATION_ID        "f001" // not part of BLE spec

// how often the station ID is checked for changes
#define STATION_ID_CHECK_INTERVAL_MS 1000

namespace ble {
  extern BLEService sv_devinfo;
  extern BLEStringCharacteristic ch_manufacturer;
  extern BLEByteCharacteristic ch_stationID;
  extern uint8_t val_stationID;

  /** set up how the sensor station appears to other BLE devices */
  void devinfo_setup();

  /** run timer to periodically check station ID for changes */
  void devinfo_update();

  /** check station ID for changes */
  void update_station_id();
} // namespace ble

#endif
