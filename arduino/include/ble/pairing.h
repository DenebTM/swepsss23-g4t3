#ifndef _BLE_PAIR_H
#define _BLE_PAIR_H

#include "ble.h"

#define BLE_NO_PAIRED_DEVICE          String("")
#define BLE_PAIRING_MODE_TIMEOUT_MS   5 * 60 * 1000

#define BUTTON_ID_BLE_PAIRING         0

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
