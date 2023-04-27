#ifndef _BLE_PAIR_H
#define _BLE_PAIR_H

#include "ble.h"

#include <led.h>
using namespace std::chrono_literals;

#define BLE_PAIRING_MODE_TIMEOUT_MS   5 * 60 * 1000

#define BUTTON_ID_BLE_PAIRING         0

static led::StatusCode* const LEDC_BLE_UNPAIRED = new led::StatusCode{
  LED_SOLID(led::Color::RED)
};
static led::StatusCode* const LEDC_BLE_PAIRING = new led::StatusCode{
  LED_BLINK_ONCE_SHORT(led::Color::BLUE)
};
static led::StatusCode* const LEDC_BLE_CONNECTED = new led::StatusCode{
  LED_SOLID(led::Color::GREEN)
};
static led::StatusCode* const LEDC_BLE_DISCONNECTED = new led::StatusCode{
  LED_BLINK_ONCE(led::Color::RED, 1s)
};

namespace ble::pairing {
  /** enable pairing button */
  void setup();

  /** check if button was pressed and handle connection requests */
  void update();

  namespace mode {
    extern volatile bool entering;
    extern bool active;
    extern unsigned long active_since;

    void enter();
    void exit();
  }
}

#endif
