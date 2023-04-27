#include <ble/sv_envsense.h>

#include <tuple>
#include <vector>

#include <common.h>
#include <hwtimer.h>
#include <sensors/data.h>

namespace ble {
  BLEService sv_envsense(BLE_UUID_ESS);

  // array of BLE characteristics and their associated sensor values
  // clang-format off
  std::vector<std::pair<BLECharacteristic*, void*>> envsense_chars = {
    { new BLEUnsignedIntCharacteristic(BLE_UUID_AIR_PRESSURE, BLERead | BLENotify),   &sensors::current_data.air_pressure },
    { new BLEShortCharacteristic(BLE_UUID_TEMPERATURE, BLERead | BLENotify),          &sensors::current_data.temperature },
    { new BLEUnsignedShortCharacteristic(BLE_UUID_HUMIDITY, BLERead | BLENotify),     &sensors::current_data.humidity },
    // illuminance is stored as uint32_t internally, the extra byte gets truncated upon write
    // since this value cannot possibly go above ~1000, integer overflow is not a concern
    { new BLECharacteristic(BLE_UUID_ILLUMINANCE, BLERead | BLENotify, 3, true),      &sensors::current_data.illuminance },
    { new BLEUnsignedShortCharacteristic(BLE_UUID_AIR_QUALITY, BLERead | BLENotify),  &sensors::current_data.air_quality },
    { new BLEUnsignedCharCharacteristic(BLE_UUID_SOIL_MOISTURE, BLERead | BLENotify), &sensors::current_data.soil_moisture },
  };
  // clang-format on

  // Flags for periodic tasks
  volatile bool shall_write_sensor_data = false;

  // set up environmental sensing service
  void envsense_setup() {
    for (auto tup : envsense_chars) {
      auto ble_char = std::get<0>(tup);
      sv_envsense.addCharacteristic(*ble_char);
    }

    BLE.addService(sv_envsense);

    hwtimer::attach_flag_isr(BLE_ENVSENSE_TRANSMIT_INTERVAL_MS,
                             &shall_write_sensor_data);
  }

  void envsense_update() {
    if (shall_write_sensor_data) {
      shall_write_sensor_data = false;

      // transmit values stored in `current_data` via BLE
      for (auto tup : envsense_chars) {
        auto ble_char = std::get<0>(tup);
        auto val_ptr  = std::get<1>(tup);

        ble_char->writeValue(val_ptr, ble_char->valueLength());
      }
    }
  }
} // namespace ble
