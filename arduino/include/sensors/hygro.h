#ifndef _SENSORS_HYGRO_H
#define _SENSORS_HYGRO_H

#include <Arduino.h>
#include <chrono>
using namespace std::chrono_literals;

#define HYGRO_PIN A6
#define HYGRO_CALIB_AIR_VALUE \
  850 // value read with sensor placed in empty container
#define HYGRO_CALIB_WATER_VALUE \
  430 // value read with sensor fully submerged in water

// keep track of this many samples for averaging
#define HYGRO_SAMPLE_COUNT 300
// time between each measurements
#define HYGRO_READ_INTERVAL 10ms
// output/transmit data after each full sample cycle
#define HYGRO_OUTPUT_INTERVAL (HYGRO_SAMPLE_COUNT * HYGRO_READ_INTERVAL)

namespace sensors::hygro {
  void setup();

  // runs internal timers; call this in the main loop
  void update();

  // reads a single, unnormalized sample from the hygrometer
  int read();

  /**
   * returns humidity value between 0 and 100 (%), averaged over all values in
   * `samples` will return invalid values before update() has been called
   * `HYGRO_SAMPLE_COUNT` times
   */
  int read_hum();
} // namespace sensors::hygro

#endif