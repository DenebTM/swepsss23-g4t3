#include <sensors/hygro.h>

#include <Ticker.h>

namespace sensors::hygro { 
  int next_sample_idx = 0;
  long samples[HYGRO_SAMPLE_COUNT] = { 0 };

  void do_read() {
    samples[next_sample_idx] = read();
    next_sample_idx = (next_sample_idx + 1) % HYGRO_SAMPLE_COUNT;
  }

  void do_output() {
    Serial.println("Soil moisture: " + String(read_hum()) + "%");
  }

  // Software timers for reading and outputting
  // I would use hardware timers but something™️ makes everything hang if I do
  Ticker read_timer(do_read, HYGRO_READ_INTERVAL_MS);
  Ticker output_timer(do_output, HYGRO_OUTPUT_INTERVAL_MS);
}

void sensors::hygro::setup() {
  pinMode(HYGRO_PIN, INPUT);

  read_timer.start();
  output_timer.start();
}

int sensors::hygro::read() {
  return analogRead(HYGRO_PIN);
}

void sensors::hygro::update() {
  read_timer.update();
  output_timer.update();
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