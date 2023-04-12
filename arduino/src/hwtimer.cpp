#include <hwtimer.h>

#include <NRF52_MBED_TimerInterrupt_Generic.h>

namespace hwtimer {
  NRF52_MBED_Timer timer(NRF_TIMER_4);

  /**
   * this function exists to abstract away the internal timer object, and set
   * the interval in milli- instead of microseconds
   */
  bool attach_isr(unsigned int interval_ms, voidFuncPtr callback) {
    return timer.attachInterruptInterval(interval_ms * 1000, callback);
  }
}