#ifndef _SENSORS_DATA_H
#define _SENSORS_DATA_H

#include <Arduino.h>

namespace sensors {
  struct sensor_data {
    float air_pressure;
    float air_quality;
    float humidity;
    float temperature; 
    unsigned int illuminance;
    unsigned int soil_moisture;
  };

  extern struct sensor_data current_data;
}

#endif
