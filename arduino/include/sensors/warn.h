#ifndef _SENSORS_WARN_H
#define _SENSORS_WARN_H

#include <Arduino.h>

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
}

#endif
