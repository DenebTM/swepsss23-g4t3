#ifndef _SENSORS_DATA_H
#define _SENSORS_DATA_H

#include <Arduino.h>

#include <common.h>

namespace sensors {
  struct sensor_data {
    // normalized BME688 sensor values provided by the `bsec2` library
    uint32_t air_pressure;
    uint16_t air_quality;
    uint16_t humidity;
    int16_t temperature;

    // normalized illuminance (0..n lx) read from light sensor (see `light.cpp`)
    uint32_t illuminance;

    // normalized soil moisture (0..100%) read from light sensor (see `light.cpp`)
    uint8_t soil_moisture;
  };

  extern struct sensor_data current_data;
}

#endif
