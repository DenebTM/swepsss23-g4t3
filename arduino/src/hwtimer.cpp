#include <hwtimer.h>

#include <NRF52_MBED_TimerInterrupt_Generic.h>
#include <ISR_Timer_Generic.h>

#define INTERNAL_TIMER_INTERVAL_US 1000

namespace hwtimer {
  NRF52_MBED_Timer internal_timer(NRF_TIMER_4);
  ISR_Timer multiplexed_timer;
  bool timer_setup = false;

  int set_interval(unsigned int interval, voidFuncPtr callback) {
    // Enable hardware timer upon first time setting an interval
    if (!timer_setup) {
      if (!internal_timer.attachInterruptInterval(INTERNAL_TIMER_INTERVAL_US,
        []() { multiplexed_timer.run(); })) {
          return -1;
      }

      timer_setup = true;
    }

    return multiplexed_timer.setInterval(interval, callback);
  }
}
