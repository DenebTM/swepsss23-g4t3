#ifndef _BLE_H
#define _BLE_H
#include <ArduinoBLE.h>

#define BLE_DEVICE_NAME "PlantHealth Greenhouse"

// Services
extern BLEService ble_sv_heartbeat;

// Characteristics
extern BLEByteCharacteristic ble_ch_stationID;

extern uint8_t ble_val_stationID;

int ble_setup();
void ble_update();

#endif