#include <buttons.h>

#include <drivers/InterruptIn.h>

#include <common.h>

bool buttons::setup(unsigned int button_id, voidFuncPtr callback) {
  // don't attempt to set up a button on pins that don't have a button attached
  if (button_id > 2)
    return false;
  
  pinMode(BUTTON0_PIN + button_id, INPUT_PULLUP);
  mbed::InterruptIn* button = new mbed::InterruptIn(digitalPinToPinName(BUTTON0_PIN + button_id));

  // debounce button press before running the callback
  button->rise([callback]() {
    static timestamp_t last_isr_timestamp;
    timestamp_t isr_timestamp = millis();
    if (isr_timestamp - last_isr_timestamp >= DEBOUNCE_LOCKOUT_MILLIS) {
      callback();
    }
    last_isr_timestamp = isr_timestamp;
  });

  return true;
}
