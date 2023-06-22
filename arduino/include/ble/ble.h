#ifndef _BLE_H
#define _BLE_H

#include <Arduino.h>
#include <ArduinoBLE.h>
#include <led.h>

#define BLE_DEVICE_NAME         "PH SensorStation"
#define BLE_DEVICE_MANUFACTURER "UIBK SE G4T3"
#define BLE_DEVICE_APPEARANCE   0x3621

#define BLE_NO_PAIRED_DEVICE String("")

static led::StatusCode* const LEDC_BLE_SETUP_FAILED =
    new led::StatusCode { LED_BLINK_ONCE_SHORT(led::Color::RED) };

namespace ble {
  extern String paired_mac;
  extern bool is_advertising;

  /**
   * Initializes various internal variables, timers, services, etc.
   * intended to be run as part of the startup sequence
   *
   * returns true on success, false if BLE could not be initialized
   */
  bool setup();

  /**
   * checks for new BLE device events and whether to enter or leave pairing mode
   * intended to be run as part of the main loop
   */
  void update();
} // namespace ble

#endif
