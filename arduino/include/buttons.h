#ifndef _BUTTONS_H
#define _BUTTONS_H

#include <Arduino.h>

// buttons are connected to pins 2, 3 and 4
#define BUTTON0_PIN             2
#define DEBOUNCE_LOCKOUT_MILLIS 50

namespace buttons {
  int setup(unsigned int button_id, voidFuncPtr callback);
}

#endif
