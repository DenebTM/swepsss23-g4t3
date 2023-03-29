#include <Arduino.h>
#include <ble.h>

void setup() {
  Serial.begin(9600);
  while (!Serial);

  ble_setup();
}

void loop() {
  ble_update();
  delay(10);
}
