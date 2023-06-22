#ifndef _SENSORS_WARN_H
#define _SENSORS_WARN_H

#include <Arduino.h>
#include <led.h>

#define _LED_WARN_CODE_VARIANT_1(color)                   \
  LED_BLINK_ONCE_LONG(color), LED_BLINK_ONCE_LONG(color), \
      LED_BLINK_ONCE_LONG(color), LED_BLINK_LAST_LONG(color)

#define _LED_WARN_CODE_VARIANT_2(color)                        \
  LED_BLINK_ONCE_SHORT(color), LED_BLINK_ONCE_SHORT(color),    \
      LED_BLINK_ONCE_SHORT(color), LED_BLINK_ONCE_LONG(color), \
      LED_BLINK_ONCE_LONG(color), LED_BLINK_LAST_LONG(color)

static led::StatusCode* const LEDC_WARN_AIR_PRESSURE =
    new led::StatusCode { _LED_WARN_CODE_VARIANT_1(led::Color::YELLOW) };
static led::StatusCode* const LEDC_WARN_TEMPERATURE =
    new led::StatusCode { _LED_WARN_CODE_VARIANT_2(led::Color::YELLOW) };
static led::StatusCode* const LEDC_WARN_ILLUMINANCE =
    new led::StatusCode { _LED_WARN_CODE_VARIANT_1(led::Color::PURPLE) };
static led::StatusCode* const LEDC_WARN_AIR_QUALITY =
    new led::StatusCode { _LED_WARN_CODE_VARIANT_2(led::Color::PURPLE) };
static led::StatusCode* const LEDC_WARN_HUMIDITY =
    new led::StatusCode { _LED_WARN_CODE_VARIANT_1(led::Color::CYAN) };
static led::StatusCode* const LEDC_WARN_SOIL_MOISTURE =
    new led::StatusCode { _LED_WARN_CODE_VARIANT_2(led::Color::CYAN) };

namespace sensors {
  struct sensor_warnings {
    bool air_pressure;
    bool temperature;
    bool humidity;
    bool illuminance;
    bool air_quality;
    bool soil_moisture;
  };

  extern struct sensor_warnings current_warnings;

  void warn_update(bool force = false);
} // namespace sensors

#endif
