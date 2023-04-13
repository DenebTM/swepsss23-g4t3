#include <hwtimer.h>

#include <drivers/LowPowerTicker.h>
#include <vector>
#include <chrono>
using namespace std::chrono_literals;

#define INTERNAL_TIMER_INTERVAL_US 1000

namespace hwtimer {
  std::vector<mbed::LowPowerTicker*> tickers;

  void set_interval(unsigned int interval, mbed::Callback<void()> callback) {
    mbed::LowPowerTicker *t = new mbed::LowPowerTicker();
    t->attach(callback, interval * 1ms);
    tickers.push_back(t);
  }
}
