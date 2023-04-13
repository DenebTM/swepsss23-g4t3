#ifndef _HWTIMER_H
#define _HWTIMER_H

#include <Arduino.h>

namespace hwtimer {
  /**
   * Set up a function `callback` to be called every `interval` milliseconds.
   * 
   * `callback` is run in an interrupt context and must thus adhere to certain
   * limitations, such as not being able to use functions that themselves rely
   * on interrupts
   */
  int set_interval(unsigned int interval, voidFuncPtr callback);
}

#endif
