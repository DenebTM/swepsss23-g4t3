#include <sensors/hygro.h>

namespace sensors::hygro { 
  int next_sample_idx = 0;
  long samples[HYGRO_SAMPLE_COUNT] = { 0 };
}

void sensors::hygro::setup() {
  pinMode(HYGRO_PIN, INPUT);
}

int sensors::hygro::read() {
  return analogRead(HYGRO_PIN);
}

void sensors::hygro::update() {
  samples[(next_sample_idx++) % HYGRO_SAMPLE_COUNT] = read();

  if (next_sample_idx >= HYGRO_SAMPLE_COUNT) {
    next_sample_idx = 0;

    Serial.println("Soil moisture: " + String(read_hum()) + "%");
  }
}

int sensors::hygro::read_hum() {
  unsigned long long total = 0;
  for (int i = 0; i < HYGRO_SAMPLE_COUNT; i++) {
    total += samples[i];
  }
  long avg = total / HYGRO_SAMPLE_COUNT;

  // ensure we can't get values >100% or <0% due to random variance
  avg = constrain(avg, HYGRO_CALIB_WATER_VALUE, HYGRO_CALIB_AIR_VALUE);

  // return value normalized to range of 0-100%
  return map(avg, HYGRO_CALIB_AIR_VALUE, HYGRO_CALIB_WATER_VALUE, 0, 100);

}