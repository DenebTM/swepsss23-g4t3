#include <hwtimer.h>

#include <drivers/LowPowerTicker.h>
#include <vector>
#include <chrono>
using namespace std::chrono_literals;

#define INTERNAL_TIMER_INTERVAL_US 1000

namespace hwtimer {
  std::vector<mbed::LowPowerTicker*> tickers;

  void attach_isr(std::chrono::milliseconds interval, mbed::Callback<void()> callback) {
    mbed::LowPowerTicker *t = new mbed::LowPowerTicker();
    t->attach(callback, interval);
    tickers.push_back(t);
  }
}
