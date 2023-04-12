#include <ble/sv_senswarn.h>

#include <common.h>
#include <sensors/warn.h>

#define _WARN_WRITTEN_HANDLER(sensor_name) \
  void ch_warn_##sensor_name ## _written_handler ( \
    BLEDevice central, \
    BLECharacteristic characteristic \
  ) { \
    uint8_t warn = *characteristic.value(); \
    sensors::current_warnings.sensor_name = !!warn; \
    Serial.println(String(warn ? "Set" : "Cleared") + \
      " sensor warning for " #sensor_name); \
  }

#define _SETUP_WARN_CHAR(sensor_name) \
    sv_senswarn.addCharacteristic(ch_warn_##sensor_name); \
    ch_warn_##sensor_name.setEventHandler(BLEWritten, ch_warn_##sensor_name ## _written_handler);

namespace ble {
  BLEService sv_senswarn(BLE_UUID_SENSOR_WARNINGS);
  BLEUnsignedCharCharacteristic ch_warn_air_pressure (BLE_UUID_WARN_AIR_PRESSURE,  BLEWrite);
  BLEUnsignedCharCharacteristic ch_warn_temperature  (BLE_UUID_WARN_TEMPERATURE,   BLEWrite);
  BLEUnsignedCharCharacteristic ch_warn_humidity     (BLE_UUID_WARN_HUMIDITY,      BLEWrite);
  BLEUnsignedCharCharacteristic ch_warn_illuminance  (BLE_UUID_WARN_ILLUMINANCE,   BLEWrite);
  BLEUnsignedCharCharacteristic ch_warn_air_quality  (BLE_UUID_WARN_AIR_QUALITY,   BLEWrite);
  BLEUnsignedCharCharacteristic ch_warn_soil_moisture(BLE_UUID_WARN_SOIL_MOISTURE, BLEWrite);

  // define write handlers for warning characteristics
  CALL_FOREACH(_WARN_WRITTEN_HANDLER,
    air_pressure, temperature, humidity, illuminance, air_quality, soil_moisture)

  void senswarn_setup() {
    // assign write handlers for warning characteristics and add them to the service
    CALL_FOREACH(_SETUP_WARN_CHAR,
      air_pressure, temperature, humidity, illuminance, air_quality, soil_moisture)

    BLE.addService(sv_senswarn);
  }
}
