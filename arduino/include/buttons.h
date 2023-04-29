#ifndef _BUTTONS_H
#define _BUTTONS_H

#include <Arduino.h>

// buttons are connected to pins 2, 3 and 4
#define BUTTON0_PIN             2
#define DEBOUNCE_LOCKOUT_MILLIS 50

namespace buttons {
  /**
   * Sets up an interrupt to be called when a button is pressed
   *
   * Valid button IDs are 0 through 2 (TODO: probably change to 0/1)
   *
   * Returns true on success, and false if an invalid button ID was given
   */
  bool setup(unsigned int button_id, voidFuncPtr callback);
} // namespace buttons

#endif
