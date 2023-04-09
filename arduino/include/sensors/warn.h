#ifndef _SENSORS_WARN_H
#define _SENSORS_WARN_H

#include <Arduino.h>

namespace sensors {
  struct sensor_warnings {
    uint8_t air_pressure;
    uint8_t temperature;
    uint8_t humidity;
    uint8_t illuminance;
    uint8_t air_quality;
    uint8_t soil_moisture;
  };

  extern struct sensor_warnings current_warnings;
}

#endif