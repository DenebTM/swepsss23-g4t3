#include <ble/sv_senswarn.h>

#include <sensors/warn.h>

#define _WARN_WRITTEN_HANDLER(characteristic_name) \
  void ch_warn_##characteristic_name ## _written_handler ( \
    BLEDevice central, \
    BLECharacteristic characteristic \
  ) { \
    sensors::current_warnings.characteristic_name = !!characteristic.value(); \
    Serial.println(String(sensors::current_warnings.characteristic_name ? "Set" : "Cleared") + \
      " sensor warning for " #characteristic_name); \
  }

namespace ble {
  // Sensor warnings service
  BLEService sv_sensorWarnings(BLE_UUID_SENSOR_WARNINGS);
  BLEUnsignedCharCharacteristic ch_soilMoisture(BLE_UUID_WARN_AIR_PRESSURE,  BLEWrite);
  BLEUnsignedCharCharacteristic ch_soilMoisture(BLE_UUID_WARN_TEMPERATURE,   BLEWrite);
  BLEUnsignedCharCharacteristic ch_soilMoisture(BLE_UUID_WARN_HUMIDITY,      BLEWrite);
  BLEUnsignedCharCharacteristic ch_soilMoisture(BLE_UUID_WARN_ILLUMINANCE,   BLEWrite);
  BLEUnsignedCharCharacteristic ch_soilMoisture(BLE_UUID_WARN_AIR_QUALITY,   BLEWrite);
  BLEUnsignedCharCharacteristic ch_soilMoisture(BLE_UUID_WARN_SOIL_MOISTURE, BLEWrite);
}

