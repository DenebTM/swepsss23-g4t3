#ifndef _BLE_PAIR_H
#define _BLE_PAIR_H

#include "ble.h"

#include <led.h>
using namespace std::chrono_literals;

#define BLE_PAIRING_MODE_TIMEOUT_MS   5 * 60 * 1000

static led::StatusCode* const LEDC_BLE_UNPAIRED = new led::StatusCode{
  { led::Color::RED, 1500ms },
  { led::Color::OFF, 1500ms },
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

namespace ble::pairing {
  /** set up button */
  void setup();

  /** check for button press or connection requests */
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
