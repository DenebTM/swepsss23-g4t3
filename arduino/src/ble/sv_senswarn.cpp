#include <ble/sv_senswarn.h>

#include <vector>
#include <tuple>

#include <common.h>
#include <sensors/warn.h>

namespace ble {
  BLEService sv_senswarn(BLE_UUID_SENSOR_WARNINGS);

  // array of BLE characteristics, their associated warning values (and sensor name to display in console; temporary)
  auto senswarn_chars = std::vector<std::tuple<const char*, uint8_t*, BLEUnsignedCharCharacteristic*>>{
    { "air_pressure",  &sensors::current_warnings.air_pressure,  new BLEUnsignedCharCharacteristic(BLE_UUID_WARN_AIR_PRESSURE,  BLEWrite) },
    { "temperature",   &sensors::current_warnings.temperature,   new BLEUnsignedCharCharacteristic(BLE_UUID_WARN_TEMPERATURE,   BLEWrite) },
    { "humidity",      &sensors::current_warnings.humidity,      new BLEUnsignedCharCharacteristic(BLE_UUID_WARN_HUMIDITY,      BLEWrite) },
    { "illuminance",   &sensors::current_warnings.illuminance,   new BLEUnsignedCharCharacteristic(BLE_UUID_WARN_ILLUMINANCE,   BLEWrite) },
    { "air_quality",   &sensors::current_warnings.air_quality,   new BLEUnsignedCharCharacteristic(BLE_UUID_WARN_AIR_QUALITY,   BLEWrite) },
    { "soil_moisture", &sensors::current_warnings.soil_moisture, new BLEUnsignedCharCharacteristic(BLE_UUID_WARN_SOIL_MOISTURE, BLEWrite) },
  };

  void senswarn_setup() {
    for (auto tup : senswarn_chars) {
      auto ble_char = std::get<BLEUnsignedCharCharacteristic*>(tup);
      auto val_ptr = std::get<uint8_t*>(tup);
      auto sensor_name = std::get<const char*>(tup);

      ble_char->setEventHandler(BLEWritten, [sensor_name, val_ptr](
        BLEDevice central,
        BLECharacteristic characteristic
      ) {
        uint8_t warn = !!*characteristic.value();
        if (*val_ptr != warn) {
          *val_ptr = warn;
          Serial.println(String(warn ? "Set" : "Cleared") + " sensor warning for " + String(sensor_name));
        }
      });

      sv_senswarn.addCharacteristic(*ble_char);
    }

    BLE.addService(sv_senswarn);
  }
}
