#ifndef _BLE_H
#define _BLE_H

#include <cstddef>
#include <Arduino.h>
#include <ArduinoBLE.h>

#define BLE_DEVICE_NAME "PH SensorStation"
#define BLE_DEVICE_MANUFACTURER "UIBK SE G4T3"
#define BLE_DEVICE_APPEARANCE 0x3621

int ble_setup();
void ble_update();

#endif
