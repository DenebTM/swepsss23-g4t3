#include <Arduino.h>

#include <ble.h>
#include <buttons.h>
#include <led.h>
#include <sensors/bme.h>

void setup() {
  Serial.begin(9600);
  // wait for the Serial port to be initialized so that error messages during setup don't get lost
  while (!Serial);

  ble::setup();

  led::setup();
  led::set_color(led::RED);

  sensors::bme::setup();
}

void loop() {
  ble::update();

  sensors::bme::update();

  delay(10);
}
