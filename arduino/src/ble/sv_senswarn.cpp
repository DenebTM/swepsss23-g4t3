#include <ble/sv_senswarn.h>

#include <tuple>
#include <vector>

#include <common.h>
#include <sensors/warn.h>

namespace ble {
  BLEService sv_senswarn(BLE_UUID_SENSOR_WARNINGS);

  // array of BLE characteristics and their associated warning values
  // clang-format off
  auto senswarn_chars = std::vector<std::pair<bool*, BLEUnsignedCharCharacteristic*>>{
    { &sensors::current_warnings.air_pressure,  new BLEUnsignedCharCharacteristic(BLE_UUID_WARN_AIR_PRESSURE,  BLEWrite) },
    { &sensors::current_warnings.temperature,   new BLEUnsignedCharCharacteristic(BLE_UUID_WARN_TEMPERATURE,   BLEWrite) },
    { &sensors::current_warnings.humidity,      new BLEUnsignedCharCharacteristic(BLE_UUID_WARN_HUMIDITY,      BLEWrite) },
    { &sensors::current_warnings.illuminance,   new BLEUnsignedCharCharacteristic(BLE_UUID_WARN_ILLUMINANCE,   BLEWrite) },
    { &sensors::current_warnings.air_quality,   new BLEUnsignedCharCharacteristic(BLE_UUID_WARN_AIR_QUALITY,   BLEWrite) },
    { &sensors::current_warnings.soil_moisture, new BLEUnsignedCharCharacteristic(BLE_UUID_WARN_SOIL_MOISTURE, BLEWrite) },
  };
  // clang-format on

  void senswarn_setup() {
    for (auto tup : senswarn_chars) {
      auto ble_char = std::get<BLEUnsignedCharCharacteristic*>(tup);
      auto val_ptr  = std::get<bool*>(tup);

      ble_char->setEventHandler(
          BLEWritten,
          [val_ptr](BLEDevice central, BLECharacteristic characteristic) {
            bool warning_active = *characteristic.value() != 0;
            if (*val_ptr != warning_active) { *val_ptr = warning_active; }
          });

      sv_senswarn.addCharacteristic(*ble_char);
    }

    BLE.addService(sv_senswarn);
  }
} // namespace ble
