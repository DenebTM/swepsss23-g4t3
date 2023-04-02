#ifndef _SENSORS_HYGRO_H
#define _SENSORS_HYGRO_H

#include <Arduino.h>

#define HYGRO_PIN A6
#define HYGRO_SAMPLE_COUNT 300
#define HYGRO_CALIB_AIR_VALUE 850   // value read with sensor placed in empty container
#define HYGRO_CALIB_WATER_VALUE 430 // value read with sensor fully submerged in water

namespace sensors::hygro {
  void setup();

  // reads a sample from the sensor and stores it in `samples`
  void update();

  // reads a single, unnormalized sample from the hygrometer
  int read();

  /**
   * returns humidity value between 0 and 100 (%), averaged over all values in `samples`
   * will return invalid values before update() has been called `HYGRO_SAMPLE_COUNT` times
   */
  int read_hum();
}

#endif