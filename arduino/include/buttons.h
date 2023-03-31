#ifndef _BUTTONS_H
#define _BUTTONS_H

#include <Arduino.h>

// buttons are connected to pins 2, 3 and 4
#define BUTTON0_PIN 2

namespace buttons {
  static int setup(unsigned int button_id, voidFuncPtr button_isr) {
    // don't attempt to set up a button on pins that don't have a button attached
    if (button_id > 2)
      return -1;

    pinMode(BUTTON0_PIN + button_id, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(BUTTON0_PIN + button_id), button_isr, RISING);

    return 0;
  }
}

#endif