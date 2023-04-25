#include <sensors/warn.h>

#include <vector>

namespace sensors { 
  struct sensor_warnings current_warnings = { 0 };
  struct sensor_warnings last_warnings = { 0 };

  void update() {
    if (memcmp(&current_warnings, &last_warnings, sizeof(current_warnings))) {
      Serial.println("Sensor warnings have changed!\n");
      led::clear_status_codes();

      for (auto tup : std::vector<std::pair<bool, led::StatusCode* const>>{
        { current_warnings.air_pressure,  LEDC_WARN_AIR_PRESSURE  },
        { current_warnings.temperature,   LEDC_WARN_TEMPERATURE   },
        { current_warnings.humidity,      LEDC_WARN_HUMIDITY      },
        { current_warnings.illuminance,   LEDC_WARN_ILLUMINANCE   },
        { current_warnings.air_quality,   LEDC_WARN_AIR_QUALITY   },
        { current_warnings.soil_moisture, LEDC_WARN_SOIL_MOISTURE },
      }) {
        auto warn = std::get<bool>(tup);
        auto code = std::get<led::StatusCode* const>(tup);

        if (warn) {
          led::add_status_code(code);
        }
      }
    }
  }
}
