#include <sensors/light.h>

namespace sensors::light {
  // keep track of last `LIGHT_SAMPLE_COUNT` samples for averaging
  int next_sample_idx = 0;
  long samples[LIGHT_SAMPLE_COUNT] = { 0 };
}

void sensors::light::setup() {
  pinMode(LIGHT_PIN, INPUT);
}

void sensors::light::update() {
  static int last_update_timestamp;
  int current_timestamp = millis();

  // don't try to read more than once every 200ms
  if (current_timestamp - last_update_timestamp < 200) { return; }
  last_update_timestamp = current_timestamp;

  samples[(next_sample_idx++)] = analogRead(LIGHT_PIN);

  if (next_sample_idx >= LIGHT_SAMPLE_COUNT) {
    next_sample_idx = 0;

    unsigned long long total = 0;
    for (int i = 0; i < LIGHT_SAMPLE_COUNT; i++) {
      total += samples[i];
    }
    long avg = total / LIGHT_SAMPLE_COUNT;

    // perform linear interpolation for known values
    int lx_val = 0;
    if (avg <= LIGHT_VAL_20LX) {
      lx_val = map(avg, 0, LIGHT_VAL_20LX, 0, 20);
    } else if (avg <= LIGHT_VAL_50LX) {
      lx_val = map(avg, LIGHT_VAL_200LX, LIGHT_VAL_50LX, 20, 50);
    } else if (avg <= LIGHT_VAL_100LX) {
      lx_val = map(avg, LIGHT_VAL_50LX, LIGHT_VAL_100LX, 50, 100);
    // interpolate between 100 and 200, and extrapolate beyond 200
    } else {
      lx_val = map(avg, LIGHT_VAL_100LX, LIGHT_VAL_200LX, 100, 200);
    }

    Serial.println("Illuminance: " + String(lx_val) + " lx");
  }
}
