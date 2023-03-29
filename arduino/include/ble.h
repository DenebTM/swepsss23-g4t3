#ifndef _BLE_H
#define _BLE_H

#include <cstddef>
#include <Arduino.h>
#include <ArduinoBLE.h>

#define BLE_DEVICE_NAME "SensorStation G4T3"

// Services
extern BLEService ble_sv_heartbeat;

// Characteristics
extern BLEByteCharacteristic ble_ch_stationID;

extern uint8_t ble_val_stationID;

int ble_setup();
void ble_update();

#endif
