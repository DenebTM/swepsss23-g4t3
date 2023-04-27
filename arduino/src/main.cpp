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
  Serial.begin(9600);
  // wait for the Serial port to be initialized so that error messages during
  // setup don't get lost
  while (!Serial) {}

  sensors::bme::setup();
  sensors::hygro::setup();
  sensors::light::setup();

  led::setup();

  ble::setup();
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
