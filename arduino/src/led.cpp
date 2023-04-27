#include <led.h>

#include <iterator>
#include <rtos.h>

namespace led {
  using namespace std::chrono_literals;
  void restart_bg_thread();

  /**
   * iterable list of active status codes
   *
   * this exists because some of the built-in libraries can't seem to handle
   * storing a vector of (pointers to (vectors of vectors))
   *
   * two instances are initialized immediately after this class declaration,
   * one for each priority level
   */
  struct StatusCodesList {
    StatusCode* list[MAX_ACTIVE_STATUS_CODES];
    unsigned int count;

    /// append a new status code
    void append(StatusCode* code) {
      if (count == MAX_ACTIVE_STATUS_CODES) return;
      list[count++] = code;
    }

    /// remove all active status codes
    void clear() {
      unsigned int tmp_count = count;

      count = 0;
      for (unsigned int i = 0; i < tmp_count; i++) { list[i] = NULL; }
    }

    // allow iterating over all currently active status codes
    auto begin() {
      return list;
    }
    auto end() {
      return list + count;
    }

  } active_status_codes[2] = {
    { .list = { NULL }, .count = 0 }, // CodePriority::LOW
    { .list = { NULL }, .count = 0 }  // CodePriority::HIGH
  };

  // background thread for blinking the LED
  // this massively simplifies iterating over the currently active status code
  // versus a timer
  rtos::Thread* bg_thread = NULL;
  void bg_thread_func() {
    set_color(Color::OFF);
    for (;;) { // loop until terminated

      // if any high-priority codes are set, iterate over those
      // else, iterate over the low-priority codes
      auto active_list = (active_status_codes[CodePriority::HIGH].count > 0)
                             ? CodePriority::HIGH
                             : CodePriority::LOW;

      for (auto code : active_status_codes[active_list]) {
        for (auto tup : *code) {
          const auto duration = std::get<ColorDuration>(tup);
          auto next_update    = rtos::Kernel::Clock::now() + duration;

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
    uint8_t green = (active_color & 0x00FF00) >> 8;
    uint8_t blue  = (active_color & 0x0000FF) >> 0;

    analogWrite(LED_RED_PIN, red);
    analogWrite(LED_GREEN_PIN, green);
    analogWrite(LED_BLUE_PIN, blue);
  }

  void set_status_codes(StatusCode* const new_codes[],
                        unsigned int new_codes_count,
                        CodePriority prio) {
    clear_status_codes(prio);
    for (unsigned int i = 0; i < new_codes_count; i++) {
      add_status_code(new_codes[i], prio);
    }
    restart_bg_thread();
  }

  void set_status_code(StatusCode* const code, CodePriority prio) {
    StatusCode* const codes_list[1] = { code };
    set_status_codes(codes_list, 1, prio);
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

  void clear_status_codes(CodePriority prio) {
    active_status_codes[prio].clear();
  }

  void add_status_code(StatusCode* const code, CodePriority prio) {
    active_status_codes[prio].append(code);
    start_bg_thread();
  }
} // namespace led
