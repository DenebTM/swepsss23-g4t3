#ifndef _BLE_PAIR_H
#define _BLE_PAIR_H

#include "ble.h"

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
