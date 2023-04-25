#ifndef _SENSORS_WARN_H
#define _SENSORS_WARN_H

#include <Arduino.h>
#include <led.h>

static led::StatusCode* const LEDC_WARN_AIR_PRESSURE = new led::StatusCode{
  { led::Color::YELLOW, 500ms },
  { led::Color::OFF,    500ms },
  { led::Color::YELLOW, 500ms },
  { led::Color::OFF,    500ms },
  { led::Color::YELLOW, 500ms },
  { led::Color::OFF,    500ms },
};
static led::StatusCode* const LEDC_WARN_TEMPERATURE = new led::StatusCode{
  { led::Color::YELLOW, 200ms },
  { led::Color::OFF,    200ms },
  { led::Color::YELLOW, 200ms },
  { led::Color::OFF,    200ms },
  { led::Color::YELLOW, 200ms },
  { led::Color::OFF,    200ms },
  { led::Color::YELLOW, 500ms },
  { led::Color::OFF,    500ms },
  { led::Color::YELLOW, 500ms },
  { led::Color::OFF,    500ms },
};
static led::StatusCode* const LEDC_WARN_ILLUMINANCE = new led::StatusCode{
  { led::Color::PURPLE, 500ms },
  { led::Color::OFF,    500ms },
  { led::Color::PURPLE, 500ms },
  { led::Color::OFF,    500ms },
  { led::Color::PURPLE, 500ms },
  { led::Color::OFF,    500ms },
};
static led::StatusCode* const LEDC_WARN_AIR_QUALITY = new led::StatusCode{
  { led::Color::PURPLE, 200ms },
  { led::Color::OFF,    200ms },
  { led::Color::PURPLE, 200ms },
  { led::Color::OFF,    200ms },
  { led::Color::PURPLE, 200ms },
  { led::Color::OFF,    200ms },
  { led::Color::PURPLE, 500ms },
  { led::Color::OFF,    500ms },
  { led::Color::PURPLE, 500ms },
  { led::Color::OFF,    500ms },
};
static led::StatusCode* const LEDC_WARN_HUMIDITY = new led::StatusCode{
  { led::Color::CYAN,   500ms },
  { led::Color::OFF,    500ms },
  { led::Color::CYAN,   500ms },
  { led::Color::OFF,    500ms },
  { led::Color::CYAN,   500ms },
  { led::Color::OFF,    500ms },
};
static led::StatusCode* const LEDC_WARN_SOIL_MOISTURE = new led::StatusCode{
  { led::Color::CYAN,   200ms },
  { led::Color::OFF,    200ms },
  { led::Color::CYAN,   200ms },
  { led::Color::OFF,    200ms },
  { led::Color::CYAN,   200ms },
  { led::Color::OFF,    200ms },
  { led::Color::CYAN,   500ms },
  { led::Color::OFF,    500ms },
  { led::Color::CYAN,   500ms },
  { led::Color::OFF,    500ms },
};

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

  void warn_update();
}

#endif
