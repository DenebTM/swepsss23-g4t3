#include <sensors/light.h>
#include <sensors/data.h>

#include <Ticker.h>

namespace sensors::light {
  int next_sample_idx = 0;
  long samples[LIGHT_SAMPLE_COUNT] = { 0 };

  static void do_read() {
    samples[next_sample_idx] = analogRead(LIGHT_PIN);
    next_sample_idx = (next_sample_idx + 1) % LIGHT_SAMPLE_COUNT;
  }

  static void do_output() {
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

  // Software timers for reading and outputting
  // I would use hardware timers but something™️ makes everything hang if I do
  Ticker read_timer(do_read, LIGHT_READ_INTERVAL_MS);
  Ticker output_timer(do_output, LIGHT_OUTPUT_INTERVAL_MS);
}

void sensors::light::setup() {
  pinMode(LIGHT_PIN, INPUT);

  read_timer.start();
  output_timer.start();
}

void sensors::light::update() {
  read_timer.update();
  output_timer.update();
}
