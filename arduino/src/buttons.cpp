#include <buttons.h>

#include <common.h>

// debounce button presses before calling the actual function
// defined as a macro in order to avoid repeating this code three times
#define _BUTTON_ISR(id) []() { \
  if (!button_funcs[id]) return; \
  static timestamp_t last_isr_timestamp; \
  timestamp_t isr_timestamp = millis(); \
  if (isr_timestamp - last_isr_timestamp >= DEBOUNCE_LOCKOUT_MILLIS) { \
    button_funcs[id](); \
  } \
  last_isr_timestamp = isr_timestamp; \
}

namespace buttons {
  voidFuncPtr button_funcs[3];
  voidFuncPtr button_isrs[3] = { _BUTTON_ISR(0), _BUTTON_ISR(1), _BUTTON_ISR(2) };
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
