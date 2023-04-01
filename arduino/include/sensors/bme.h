#ifndef _SENSORS_BME_H
#define _SENSORS_BME_H

#include <Arduino.h>
#include <Wire.h>
#include <bsec2.h>

namespace sensors::bme {
  static Bme68x sensor;
  static Bsec2 bsec;

  // returns true on success, false if the sensor could not be found
  bool setup();

  // returns true on success, false if an error occurred or the sensor could not be found
  bool update();
}

#endif