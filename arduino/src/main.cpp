#include <Arduino.h>

#include <ble.h>
#include <led.h>

void setup() {
  Serial.begin(9600);
  // wait for the Serial port to be initialized so that error messages during setup don't get lost
  while (!Serial);

  ble::setup();

  led::setup();
  led::set_color(led::RED);
}

void loop() {
  ble::update();
  delay(10);
}
