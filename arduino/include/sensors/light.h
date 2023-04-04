#ifndef _SENSORS_LIGHT_H
#define _SENSORS_LIGHT_H

#include <Arduino.h>

/**
 * ================ Best-effort explanation of the calculation ================
 * 
 *   Depending on the light level, the photo-transistor drops a certain amount
 * of voltage. This can be visualized using a load line on the datasheet.
 *   The analogue reference voltage Vref is 3.3V. By subtracting Vce from Vref,
 * we can determine the expected voltage on the ADC pin for a given light level
 * between 20 and 200 lux.
 * See also:
 * - arduino/light_loadline.png
 * - https://electronics.stackexchange.com/a/447084
 * - https://en.wikipedia.org/wiki/Load_line_(electronics
 * 
 *   The ADC has a resolution of 10 bits (by default); 0 corresponds to 0V,
 * 1023 corresponds to Vref (3.3V).
 * Thus:
 * #   LUX |  VADC | analogRead()
 * -  20lx ~ 0.17V ~ 53
 * -  50lx ~ 0.25V ~ 78
 * - 100lx ~ 0.50V ~ 155
 * - 200lx ~ 0.80V ~ 248
 * 
 *   Then linear interpolation is used to get the LUX value from the input.
 * Unfortunately our phototransistor is complete garbage and only ever measures
 * values below 50 unless a flashlight is pressed to its face, even out in
 * daylight, so the values we read are not very useful right now. I tried tho.
 */

#define LIGHT_PIN A7

#define LIGHT_VAL_20LX   53
#define LIGHT_VAL_50LX   78
#define LIGHT_VAL_100LX 155
#define LIGHT_VAL_200LX 248

// keep track of this many samples for averaging
#define LIGHT_SAMPLE_COUNT 15
// time between samples, in milliseconds
#define LIGHT_READ_INTERVAL_MS 200
// output/transmit data after each full sample cycle
#define LIGHT_OUTPUT_INTERVAL_MS LIGHT_SAMPLE_COUNT * LIGHT_READ_INTERVAL_MS

namespace sensors::light {
  void setup();

  // runs internal timers; call this in the main loop
  void update();
}

#endif