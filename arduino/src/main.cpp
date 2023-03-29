#include <ArduinoBLE.h>
#include <ble.h>

void setup() {
  Serial.begin(9600);
  while (!Serial);

  ble_setup();
}

void loop() {
  ble_update();
  delay(1000);
}
