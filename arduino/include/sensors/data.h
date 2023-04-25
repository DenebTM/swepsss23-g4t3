#ifndef _SENSORS_DATA_H
#define _SENSORS_DATA_H

#include <Arduino.h>

#include <common.h>

namespace sensors {
  struct sensor_data {
    uint32_t air_pressure;
    uint16_t air_quality;
    uint16_t humidity;
    int16_t temperature;
    uint32_t illuminance;
    uint8_t soil_moisture;
  };

  // last-read sensor data, stored in the format required by BLE
  extern struct sensor_data current_data;
}

#endif
