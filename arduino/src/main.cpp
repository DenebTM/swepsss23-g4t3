#include <Arduino.h>
#include <mbed.h>
using namespace std::chrono_literals;

#include <ble/ble.h>
#include <buttons.h>
#include <led.h>
#include <sensors/bme.h>
#include <sensors/hygro.h>
#include <sensors/light.h>
#include <sensors/warn.h>

void setup() {
  // Serial.begin(9600);
  // while (!Serial) {}

  led::setup();

  sensors::hygro::setup();
  sensors::light::setup();

  if (!sensors::bme::setup()) {
    led::add_status_code(LEDC_BME_SETUP_FAILED, led::CodePriority::HIGH);

    // failure state
    for (;;) { rtos::ThisThread::sleep_for(1ms); }
  }

  if (!ble::setup()) {
    led::add_status_code(LEDC_BLE_SETUP_FAILED, led::CodePriority::HIGH);

    // failure state
    for (;;) { rtos::ThisThread::sleep_for(1ms); }
  }
}

void loop() {
  sensors::bme::update();
  sensors::hygro::update();
  sensors::light::update();
  sensors::warn_update();

  ble::update();

  // reduce power consumption
  rtos::ThisThread::sleep_for(1ms);
}
