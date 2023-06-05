#include <sensors/warn.h>

#include <vector>

#include <beep.h>
#include <ble/pairing.h>

namespace sensors {
  struct sensor_warnings current_warnings = { 0 };
  struct sensor_warnings last_warnings    = { 0 };

  void warn_update(bool force) {
    if (force ||
        memcmp(&last_warnings, &current_warnings, sizeof(current_warnings))) {
      memcpy(&last_warnings, &current_warnings, sizeof(current_warnings));

      // Serial.println("Sensor warnings have changed!");
      led::clear_status_codes(led::CodePriority::LOW);

      bool any_warnings = false;
      for (auto tup : std::vector<std::pair<bool, led::StatusCode* const>> {
               { current_warnings.air_pressure, LEDC_WARN_AIR_PRESSURE },
               { current_warnings.temperature, LEDC_WARN_TEMPERATURE },
               { current_warnings.humidity, LEDC_WARN_HUMIDITY },
               { current_warnings.illuminance, LEDC_WARN_ILLUMINANCE },
               { current_warnings.air_quality, LEDC_WARN_AIR_QUALITY },
               { current_warnings.soil_moisture, LEDC_WARN_SOIL_MOISTURE },
           }) {
        auto warn = std::get<bool>(tup);
        auto code = std::get<led::StatusCode* const>(tup);

        if (warn) {
          any_warnings = true;
          led::add_status_code(code, led::CodePriority::LOW);
        }
      }

      if (any_warnings) {
        beep::start();
      } else {
        // return to the "all ok" status code if there are no active warnings
        led::set_status_code(LEDC_BLE_CONNECTED, led::CodePriority::LOW);
        beep::stop();
      }
    }
  }
} // namespace sensors
