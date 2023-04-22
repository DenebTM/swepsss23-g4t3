#ifndef _HWTIMER_H
#define _HWTIMER_H

#include <mbed.h>

namespace hwtimer {
  /**
   * Set up a function `callback` to be called every `interval` milliseconds.
   * 
   * `callback` is run in an interrupt context and must thus adhere to certain
   * limitations, such as not being able to use functions that themselves rely
   * on interrupts
   */
  void attach_isr(unsigned int interval, mbed::Callback<void()> callback);
  
  /**
   * Sets up a simple callback to set `*flag` to `true` every `interval` milliseconds
   * 
   * Used by various modules' setup functions to set up their respective timers
   */
  inline void attach_flag_isr(unsigned int interval, volatile bool* flag) {
    attach_isr(interval, [flag]() { *flag = true; });
  }
}

#endif
