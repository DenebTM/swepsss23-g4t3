#include "buttons.h"

#define _BUTTON_ISR(id) \
  static void isrb##id() { \
    if (!button_funcs[id]) return; \
    static unsigned long last_isr_timestamp; \
    unsigned long isr_timestamp = millis(); \
    if (isr_timestamp - last_isr_timestamp >= DEBOUNCE_LOCKOUT_MILLIS) { \
      button_funcs[id](); \
    } \
    last_isr_timestamp = isr_timestamp; \
  }

namespace buttons {
  voidFuncPtr button_funcs[3];

  _BUTTON_ISR(0)
  _BUTTON_ISR(1)
  _BUTTON_ISR(2)
  voidFuncPtr button_isrs[3] = { isrb0, isrb1, isrb2 };
}

int buttons::setup(unsigned int button_id, voidFuncPtr button_func) {
  // don't attempt to set up a button on pins that don't have a button attached
  if (button_id > 2)
    return -1;

  button_funcs[button_id] = button_func;
  pinMode(BUTTON0_PIN + button_id, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(BUTTON0_PIN + button_id), button_isrs[button_id], RISING);

  return 0;
}