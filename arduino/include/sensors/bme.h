#ifndef _SENSORS_BME_H
#define _SENSORS_BME_H

#include <Arduino.h>
#include <Wire.h>
#include <bsec2.h>

namespace sensors::bme {
  extern Bme68x sensor;
  extern Bsec2 bsec;

  // returns true on success, false if the sensor could not be found
  bool setup();

  // runs internal timers; call this in the main loop
  // returns true on success, false if an error occurred or the sensor could not
  // be found
  bool update();
} // namespace sensors::bme

#endif