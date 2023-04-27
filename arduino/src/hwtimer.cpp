#include <hwtimer.h>

#include <chrono>
#include <drivers/LowPowerTicker.h>
#include <vector>
using namespace std::chrono_literals;

#define INTERNAL_TIMER_INTERVAL_US 1000

namespace hwtimer {
  std::vector<mbed::LowPowerTicker*> tickers;

  void attach_isr(unsigned int interval, mbed::Callback<void()> callback) {
    mbed::LowPowerTicker* t = new mbed::LowPowerTicker();
    t->attach(callback, interval * 1ms);
    tickers.push_back(t);
  }
} // namespace hwtimer
