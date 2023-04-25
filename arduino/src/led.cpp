#include <led.h>

#include <rtos.h>

namespace led {
  using namespace std::chrono_literals;
  void restart_bg_thread();

  // background thread for blinking the LED
  // this massively simplifies iterating over the currently active status code
  // versus a timer
  rtos::Thread* bg_thread = NULL;
  unsigned int active_status_codes_count = 0;
  StatusCode* active_status_codes[MAX_ACTIVE_STATUS_CODES] = { 0 };
  void bg_thread_func() {
    set_color(Color::OFF);
    for (;;) { // loop until terminated
      for (unsigned int i = 0; i < active_status_codes_count; i++) {
        auto code = active_status_codes[i];
        for (auto tup : *code) {
          const auto duration = std::get<ColorDuration>(tup);
          auto next_update = rtos::Kernel::Clock::now() + duration;

          const auto color = std::get<Color>(tup);
          set_color(color);

          rtos::ThisThread::sleep_until(next_update);
        }
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
    clear_status_codes();
    add_status_code(code);
    restart_bg_thread();
  }

  void set_status_codes(StatusCode* const new_codes[], unsigned int new_codes_count) {
    clear_status_codes();
    for (unsigned int i = 0; i < new_codes_count; i++) {
      add_status_code(new_codes[i]);
    }
    restart_bg_thread();
  }


  // Helper functions

  void stop_bg_thread() {
    if (bg_thread) {
      bg_thread->terminate();
      delete bg_thread;
      bg_thread = NULL;
    }
  }
  void start_bg_thread() {
    if (!bg_thread) {
      bg_thread = new rtos::Thread();
      bg_thread->start(bg_thread_func);
    }
  }

  void restart_bg_thread() {
    stop_bg_thread();
    start_bg_thread();
  }

  void clear_status_codes() {
    active_status_codes_count = 0;
    for (unsigned int i = 0; i < active_status_codes_count; i++) {
      active_status_codes[i] = NULL;
    }
  }

  void add_status_code(StatusCode* const code) {
    if (active_status_codes_count == MAX_ACTIVE_STATUS_CODES) return;
    active_status_codes[active_status_codes_count++] = code;

    start_bg_thread();
  }
}
