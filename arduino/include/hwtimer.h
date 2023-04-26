#ifndef _HWTIMER_H
#define _HWTIMER_H

#include <mbed.h>
#include <chrono>

namespace hwtimer {
  /**
   * Set up a `callback` to be run periodically by a timer interrupt.
   * 
   * Due to `callback` being run in an interrupt context, it must adhere to
   * certain limitations, such as not being able to use functions that
   * themselves rely on interrupts.
   */
  void attach_isr(std::chrono::milliseconds interval, mbed::Callback<void()> callback);
  
  /**
   * Set up `*flag` to be periodically set to `true` by a timer interrupt.
   * 
   * Used by various modules' setup functions to set up their respective
   * periodic tasks.
   */
  inline void attach_flag_isr(std::chrono::milliseconds interval, volatile bool* flag) {
    attach_isr(interval, [flag]() { *flag = true; });
  }
}

#endif
