#include <led.h>

#include <rtos.h>

namespace led {
  using namespace std::chrono_literals;
  void clear_status_codes();
  void add_status_code(StatusCode* const code);
  void restart_bg_thread();

  // background thread for blinking the LED
  // this massively simplifies iterating over the currently active status code
  // versus a timer
  rtos::Thread* bg_thread;
  std::vector<StatusCode> active_status_codes;
  void bg_thread_func() {
    set_color(Color::OFF);
    for (;;) { // loop until terminated
      for (auto code : active_status_codes) {
        for (auto tup : code) {
          const auto duration = std::get<ColorDuration>(tup);
          auto next_update = rtos::Kernel::Clock::now() + duration;

          const auto color = std::get<Color>(tup);
          set_color(color);

          rtos::ThisThread::sleep_until(next_update);
        }

        rtos::ThisThread::sleep_for(LED_CYCLE_PAUSE_DURATION);
      }
    }
  }

  void setup() {
    pinMode(LED_RED_PIN, OUTPUT);
    pinMode(LED_GREEN_PIN, OUTPUT);
    pinMode(LED_BLUE_PIN, OUTPUT);
  }

  void set_color(Color color) {
    static Color active_color;

    if (active_color == color) return;
    active_color = color;

    uint8_t red   = (active_color & 0xFF0000) >> 16;
    uint8_t green = (active_color & 0x00FF00) >>  8;
    uint8_t blue  = (active_color & 0x0000FF) >>  0;

    analogWrite(LED_RED_PIN, red);
    analogWrite(LED_GREEN_PIN, green);
    analogWrite(LED_BLUE_PIN, blue);
  }

  void set_status_code(StatusCode* const code) {
    active_status_codes.clear();
    active_status_codes.push_back(*code);

    restart_bg_thread();
  }

  void set_status_codes(std::vector<StatusCode* const> new_codes) {
    clear_status_codes();

    for (auto code : new_codes) {
      active_status_codes.push_back(*code);
    }

    restart_bg_thread();
  }


  // Helper functions

  void restart_bg_thread() {
    if (bg_thread) {
      bg_thread->terminate();
      delete bg_thread;
    }

    bg_thread = new rtos::Thread();
    bg_thread->start(bg_thread_func);
  }

  void clear_status_codes() {
    active_status_codes.clear();
  }

  void add_status_code(StatusCode* const code) {
    active_status_codes.push_back(*code);
  }
}
