#include <Arduino.h>

#include <ble.h>
#include <buttons.h>
#include <led.h>
#include <sensors/bme.h>

bool read_sensor = false;
void read_sensor_isr() {
  read_sensor = true;
}

void setup() {
  Serial.begin(9600);
  // wait for the Serial port to be initialized so that error messages during setup don't get lost
  while (!Serial);

  ble::setup();

  led::setup();
  led::set_color(led::RED);

  sensors::bme::setup();

  buttons::setup(1, read_sensor_isr);
  Serial.println("Press button 1 (middle) to read and print BME688 sensor data");
}

void loop() {
  ble::update();

  if (read_sensor) {
    sensors::bme::read();
    read_sensor = false;
  }

  delay(10);
}
