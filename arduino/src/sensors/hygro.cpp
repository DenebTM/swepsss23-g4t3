#include <sensors/hygro.h>
#include <sensors/data.h>

#include <algorithm>

#include <hwtimer.h>

namespace sensors::hygro { 
  int next_sample_idx = 0;
  int samples[HYGRO_SAMPLE_COUNT];

  // Flags for periodic tasks
  volatile bool shall_read = false;
  volatile bool shall_output = false;
}

void sensors::hygro::setup() {
  pinMode(HYGRO_PIN, INPUT);

  // pre-fill samples with 0% humidity
  std::fill_n(samples, HYGRO_SAMPLE_COUNT, HYGRO_CALIB_AIR_VALUE);

  hwtimer::set_interval(HYGRO_READ_INTERVAL_MS, []() { shall_read = true; });
  hwtimer::set_interval(HYGRO_OUTPUT_INTERVAL_MS, []() { shall_output = true; });
}

int sensors::hygro::read() {
  return analogRead(HYGRO_PIN);
}

void sensors::hygro::update() {
  if (shall_read) {
    shall_read = false;

    samples[next_sample_idx] = read();
    next_sample_idx = (next_sample_idx + 1) % HYGRO_SAMPLE_COUNT;
  }

  if (shall_output) {
    shall_output = false;

    int moisture = read_hum();
    current_data.soil_moisture = moisture;
    Serial.println("Soil moisture: " + String(moisture) + "%");
  }
}

int sensors::hygro::read_hum() {
  unsigned long long total = 0;
  for (int i = 0; i < HYGRO_SAMPLE_COUNT; i++) {
    total += samples[(next_sample_idx + i) % HYGRO_SAMPLE_COUNT];
  }
  long avg = total / HYGRO_SAMPLE_COUNT;

  // ensure we can't get values >100% or <0% due to random variance
  avg = constrain(avg, HYGRO_CALIB_WATER_VALUE, HYGRO_CALIB_AIR_VALUE);

  // return value normalized to range of 0-100%
  return map(avg, HYGRO_CALIB_AIR_VALUE, HYGRO_CALIB_WATER_VALUE, 0, 100);
}
