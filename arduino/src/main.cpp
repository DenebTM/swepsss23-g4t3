#include <Arduino.h>
#include <mbed.h>
using namespace std::chrono_literals;

#include <ble/ble.h>
#include <buttons.h>
#include <led.h>
#include <sensors/bme.h>
#include <sensors/hygro.h>
#include <sensors/light.h>
#include <hwtimer.h>

static volatile bool toggle = false;
void timer_isr() {
  toggle = !toggle;
}

void setup() {
  Serial.begin(9600);
  // wait for the Serial port to be initialized so that error messages during setup don't get lost
  while (!Serial);

  sensors::bme::setup();
  sensors::hygro::setup();
  sensors::light::setup();

  led::setup();
  led::set_color(led::RED); // TODO: define LED colors/status codes in a central location

  ble::setup();
}

void loop() {
  sensors::bme::update();
  sensors::hygro::update();
  sensors::light::update();

  ble::update();

  // reduce power consumption
  rtos::ThisThread::sleep_for(1ms);
}
