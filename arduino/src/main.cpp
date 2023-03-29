#include <Arduino.h>
#include <ble.h>
#include <led.h>

void setup() {
  Serial.begin(9600);
  while (!Serial);

  ble_setup();

  led::setup();
  led::set_color(led::WHITE);
}

void loop() {
  ble_update();
  delay(10);
}
