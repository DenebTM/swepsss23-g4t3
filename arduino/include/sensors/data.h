#ifndef _SENSORS_DATA_H
#define _SENSORS_DATA_H

namespace sensors {
  struct sensor_data {
    float air_pressure;
    float air_quality;
    float humidity;
    float temperature; 
    int illuminance;
    int soil_moisture;
  };

  extern struct sensor_data current_data;
}

#endif