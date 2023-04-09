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
  BLEService sv_senswarn(BLE_UUID_SENSOR_WARNINGS);
  BLEUnsignedCharCharacteristic ch_warn_air_pressure (BLE_UUID_WARN_AIR_PRESSURE,  BLEWrite);
  BLEUnsignedCharCharacteristic ch_warn_temperature  (BLE_UUID_WARN_TEMPERATURE,   BLEWrite);
  BLEUnsignedCharCharacteristic ch_warn_humidity     (BLE_UUID_WARN_HUMIDITY,      BLEWrite);
  BLEUnsignedCharCharacteristic ch_warn_illuminance  (BLE_UUID_WARN_ILLUMINANCE,   BLEWrite);
  BLEUnsignedCharCharacteristic ch_warn_air_quality  (BLE_UUID_WARN_AIR_QUALITY,   BLEWrite);
  BLEUnsignedCharCharacteristic ch_warn_soil_moisture(BLE_UUID_WARN_SOIL_MOISTURE, BLEWrite);

  _WARN_WRITTEN_HANDLER(air_pressure)
  _WARN_WRITTEN_HANDLER(temperature)
  _WARN_WRITTEN_HANDLER(humidity)
  _WARN_WRITTEN_HANDLER(illuminance)
  _WARN_WRITTEN_HANDLER(air_quality)
  _WARN_WRITTEN_HANDLER(soil_moisture)

  void senswarn_setup() {
    sv_senswarn.addCharacteristic(ch_warn_air_pressure);
    ch_warn_air_pressure.setEventHandler(BLEWritten, ch_warn_air_pressure_written_handler);
    sv_senswarn.addCharacteristic(ch_warn_temperature);
    ch_warn_air_pressure.setEventHandler(BLEWritten, ch_warn_temperature_written_handler);
    sv_senswarn.addCharacteristic(ch_warn_humidity);
    ch_warn_air_pressure.setEventHandler(BLEWritten, ch_warn_humidity_written_handler);
    sv_senswarn.addCharacteristic(ch_warn_illuminance);
    ch_warn_air_pressure.setEventHandler(BLEWritten, ch_warn_illuminance_written_handler);
    sv_senswarn.addCharacteristic(ch_warn_air_quality);
    ch_warn_air_pressure.setEventHandler(BLEWritten, ch_warn_air_quality_written_handler);
    sv_senswarn.addCharacteristic(ch_warn_soil_moisture);
    ch_warn_air_pressure.setEventHandler(BLEWritten, ch_warn_soil_moisture_written_handler);

    BLE.addService(sv_senswarn);
  }
}

