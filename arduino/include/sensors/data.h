#ifndef _SENSORS_DATA_H
#define _SENSORS_DATA_H

namespace sensors {
  struct sensor_data {
    float air_pressure;
    float air_quality;
    int humidity;
    int light_intensity;
    int soil_moisture;
    float temperature; 
  };

  extern struct sensor_data current_data;
}

#endif