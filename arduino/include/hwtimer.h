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
  void set_interval(unsigned int interval, mbed::Callback<void()> callback);
  
  /**
   * Sets up a simple callback to set `*flag` to `true` every `interval` milliseconds
   */
  inline void flag_interval(unsigned int interval, volatile bool* flag) {
    set_interval(interval, [flag]() { *flag = true; });
  }
}

#endif
