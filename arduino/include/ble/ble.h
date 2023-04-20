#ifndef _BLE_H
#define _BLE_H

#include <cstddef>
#include <Arduino.h>
#include <ArduinoBLE.h>

#include <led.h>

#define BLE_DEVICE_NAME               "PH SensorStation"
#define BLE_DEVICE_MANUFACTURER       "UIBK SE G4T3"
#define BLE_DEVICE_APPEARANCE         0x3621

using namespace std::chrono_literals;
static led::StatusCode* const LEDC_BLE_UNPAIRED = new led::StatusCode{
  { led::Color::RED, 2s },
  { led::Color::OFF, 2s },
};
static led::StatusCode* const LEDC_BLE_PAIRING = new led::StatusCode{
  { led::Color::BLUE, 250ms },
  { led::Color::OFF, 250ms },
};
static led::StatusCode* const LEDC_BLE_CONNECTED = new led::StatusCode{
  { led::Color::GREEN, 100ms }
};
static led::StatusCode* const LEDC_BLE_DISCONNECTED = new led::StatusCode{
  { led::Color::YELLOW, 1s },
  { led::Color::OFF, 1s },
};

namespace ble {
  extern String paired_mac;

  /**
   * Initializes various internal variables, timers, services, etc.
   * intended to be run as part of the startup sequence
   */
  int setup();

  /**
   * checks for new BLE device events and whether to enter or leave pairing mode
   * intended to be run as part of the main loop
   */
  void update();
}

#endif
