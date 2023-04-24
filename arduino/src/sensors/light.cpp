#include <sensors/light.h>
#include <sensors/data.h>

#include <hwtimer.h>

namespace sensors::light {
  int next_sample_idx = 0;
  int samples[LIGHT_SAMPLE_COUNT] = { 0 };

  // Flags for periodic tasks
  volatile bool shall_read = false;
  volatile bool shall_output = false;

  void do_output() {
    unsigned long long total = 0;
    for (int i = 0; i < LIGHT_SAMPLE_COUNT; i++) {
      total += samples[i];
    }
    long avg = total / LIGHT_SAMPLE_COUNT;

    // perform linear interpolation between known values
    int lx_val = 0;
    if (avg <= LIGHT_VAL_20LX) {
      lx_val = map(avg, 0, LIGHT_VAL_20LX, 0, 20);
    } else if (avg <= LIGHT_VAL_50LX) {
      lx_val = map(avg, LIGHT_VAL_20LX, LIGHT_VAL_50LX, 20, 50);
    } else if (avg <= LIGHT_VAL_100LX) {
      lx_val = map(avg, LIGHT_VAL_50LX, LIGHT_VAL_100LX, 50, 100);
    // interpolate between 100 and 200, and extrapolate beyond 200
    } else {
      lx_val = map(avg, LIGHT_VAL_100LX, LIGHT_VAL_200LX, 100, 200);
    }

    current_data.illuminance = lx_val;
    Serial.println("Illuminance: " + String(lx_val) + " lx");
  }
}

void sensors::light::setup() {
  pinMode(LIGHT_PIN, INPUT);

  hwtimer::attach_flag_isr(LIGHT_READ_INTERVAL, &shall_read);
  hwtimer::attach_flag_isr(LIGHT_OUTPUT_INTERVAL, &shall_output);
}

void sensors::light::update() {
  if (shall_read) {
    shall_read = false;

    samples[next_sample_idx] = analogRead(LIGHT_PIN);
    next_sample_idx = (next_sample_idx + 1) % LIGHT_SAMPLE_COUNT;
  }

  if (shall_output) {
    shall_output = false;
    do_output();
  }
}
