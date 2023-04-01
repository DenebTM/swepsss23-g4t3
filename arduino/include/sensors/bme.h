#ifndef _SENSORS_BME_H
#define _SENSORS_BME_H

#include <Arduino.h>
#include <Wire.h>
#include <bme68xLibrary.h>

namespace sensors::bme {
  static Bme68x sensor;

  // returns true on success, false if the sensor could not be found
  bool setup();

  // returns true on success, false if an error occurred or the sensor could not be found
  bool read();
}

#endif