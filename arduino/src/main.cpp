#include <Arduino.h>

#include <ble.h>
#include <buttons.h>
#include <led.h>
#include <sensors/bme.h>
#include <sensors/hygro.h>
#include <sensors/light.h>

void setup() {
  Serial.begin(9600);
  // wait for the Serial port to be initialized so that error messages during setup don't get lost
  while (!Serial);

  sensors::bme::setup();
  sensors::hygro::setup();

  led::setup();
  led::set_color(led::RED);

  ble::setup();
}

void loop() {
  ble::update();

  sensors::bme::update();
  sensors::hygro::update();
  sensors::light::update();

  delay(10);
}
