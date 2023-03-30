#include <Arduino.h>
#include <ble.h>
#include <led.h>

void setup() {
  Serial.begin(9600);
  while (!Serial);

  ble::setup();

  led::setup();
  led::set_color(led::WHITE);
}

void loop() {
  ble::update();
  delay(10);
}
