#include <beep.h>

#include <Arduino.h>
#include <rtos.h>

namespace beep {
  using namespace std::chrono_literals;

  rtos::Thread* bg_thread = NULL;
  void bg_thread_func() {
    for (;;) {
      tone(BEEP_PIN, BEEP_FREQ);

      auto beep_off = rtos::Kernel::Clock::now() + BEEP_ON_DURATION;
      rtos::ThisThread::sleep_until(beep_off);

      noTone(BEEP_PIN);

      auto beep_on = rtos::Kernel::Clock::now() + BEEP_OFF_DURATION;
      rtos::ThisThread::sleep_until(beep_on);
    }
  }

  void start() {
    if (!bg_thread) {
      bg_thread = new rtos::Thread();
      bg_thread->start(bg_thread_func);
    }
  }

  void stop() {
    noTone(BEEP_PIN);
    if (bg_thread) {
      bg_thread->terminate();
      delete bg_thread;
      bg_thread = NULL;
    }
  }
} // namespace beep
