#include <Arduino.h>

#include <ble.h>
#include <led.h>

void setup() {
  Serial.begin(9600);

  ble::setup();

  led::setup();
  led::set_color(led::RED);
}

void loop() {
  ble::update();
  delay(10);
}
