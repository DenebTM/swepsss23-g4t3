#ifndef _BUTTONS_H
#define _BUTTONS_H

#include <Arduino.h>

#define BUTTON0_PIN 2

namespace buttons {
  static int setup(unsigned int button_id, voidFuncPtr isr) {
    if (button_id > 2)
      return -1;

    pinMode(BUTTON0_PIN + button_id, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(BUTTON0_PIN + button_id), isr, RISING);

    return 0;
  }
}

#endif