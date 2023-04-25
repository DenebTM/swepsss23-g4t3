#include <ble/sv_senswarn.h>

#include <vector>
#include <tuple>

#include <buttons.h>
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

  /**
   * denotes whether or not a warning has been set and not cleared yet
   * 
   * will only be set to `true` when a value != 0 is written to any of the `senswarn_chars`
   * will only be set to `false` after a press to button 1
   */
  BLEUnsignedCharCharacteristic ch_any_warning_active(BLE_UUID_WARN_ANY_ACTIVE, BLERead | BLENotify);

  volatile bool shall_clear_warning = false;

  void senswarn_setup() {
    buttons::setup(BUTTON_ID_CLEAR_WARNING, []() { shall_clear_warning = true; });
    sv_senswarn.addCharacteristic(ch_any_warning_active);

    for (auto tup : senswarn_chars) {
      const auto ble_char = std::get<BLEUnsignedCharCharacteristic*>(tup);
      const auto val_ptr = std::get<bool*>(tup);
      const auto sensor_name = std::get<const char*>(tup);

      ble_char->setEventHandler(BLEWritten, [sensor_name, val_ptr](
        BLEDevice central,
        BLECharacteristic characteristic
      ) {
        bool warning_active = *characteristic.value() != 0;
        if (*val_ptr != warning_active) {
          *val_ptr = warning_active;
          Serial.println(String(*val_ptr ? "Set" : "Cleared") + " sensor warning for " + String(sensor_name));

          if (warning_active) {
            ch_any_warning_active.writeValue(true);
          }
        }
      });

      sv_senswarn.addCharacteristic(*ble_char);
    }

    BLE.addService(sv_senswarn);
  }

  void senswarn_update() {
    // clear all active warnings after button has been pressed

    // yes, this desyncs with the actual values stored inside the characteristics;
    // I will consider that if it turns out to be a problem
    if (shall_clear_warning) {
      shall_clear_warning = false;
      ch_any_warning_active.writeValue(false);

      for (auto tup : senswarn_chars) {
        const auto val_ptr = std::get<bool*>(tup);
        *val_ptr = false;
      }
    }
  }
}
