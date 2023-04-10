#ifndef _SENSORS_DATA_H
#define _SENSORS_DATA_H

#include <Arduino.h>

namespace sensors {
  struct sensor_data {
    // normalized BME688 sensor values provided by the `bsec2` library
    float air_pressure;
    float air_quality;
    float humidity;
    float temperature;

    // normalized illuminance (0..n lx) read from light sensor (see `light.cpp`)
    unsigned int illuminance;

    // normalized soil moisture (0..100%) read from light sensor (see `light.cpp`)
    unsigned int soil_moisture;
  };

  extern struct sensor_data current_data;
}

#endif
