#include <ble/sv_senswarn.h>

#include <vector>
#include <tuple>

#include <common.h>
#include <sensors/warn.h>

namespace ble {
  BLEService sv_senswarn(BLE_UUID_SENSOR_WARNINGS);

  // array of BLE characteristics and their associated warning values
  // TODO: remove sensor name, this is temporary
  auto senswarn_chars = std::vector<std::tuple<const char*, bool*, BLEUnsignedCharCharacteristic*>>{
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
      auto val_ptr = std::get<bool*>(tup);
      auto sensor_name = std::get<const char*>(tup);

      ble_char->setEventHandler(BLEWritten, [sensor_name, val_ptr](
        BLEDevice central,
        BLECharacteristic characteristic
      ) {
        bool warning_active = *characteristic.value() != 0;
        if (*val_ptr != warning_active) {
          *val_ptr = warning_active;
          Serial.println(String(*val_ptr ? "Set" : "Cleared") + " sensor warning for " + String(sensor_name));
        }
      });

      sv_senswarn.addCharacteristic(*ble_char);
    }

    BLE.addService(sv_senswarn);
  }
}
