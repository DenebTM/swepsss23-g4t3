#include <led.h>

#include <rtos.h>

namespace led {
  using namespace std::chrono_literals;

  volatile bool shall_update = false;

  rtos::Thread bg_thread;

  void setup() {
    pinMode(LED_RED_PIN, OUTPUT);
    pinMode(LED_GREEN_PIN, OUTPUT);
    pinMode(LED_BLUE_PIN, OUTPUT);

    // run in a background thread
    // this massively simplifies iterating over the currently active status code
    bg_thread.start([]() {
      while (true) {
        if (!active_status_code) {
          rtos::ThisThread::sleep_for(10ms);
          continue;
        }

        set_color(Color::OFF);
        auto last_active_status_code = active_status_code;
        for (auto tup : *last_active_status_code) {
          const auto duration = std::get<ColorDuration>(tup);
          auto next_update = rtos::Kernel::Clock::now() + duration;

          const auto color = std::get<Color>(tup);
          set_color(color);

          rtos::ThisThread::sleep_until(next_update);

          // restart the loop if the status change has changed
          if (active_status_code != last_active_status_code) {
            break;
          }
        }
      }
    });
  }

  Color active_color = OFF;
  StatusCode* active_status_code;

  void set_color(Color color) {
    if (color == active_color) return;
    active_color = color;

    uint8_t red   = (color & 0xFF0000) >> 16;
    uint8_t green = (color & 0x00FF00) >>  8;
    uint8_t blue  = (color & 0x0000FF) >>  0;

    analogWrite(LED_RED_PIN, red);
    analogWrite(LED_GREEN_PIN, green);
    analogWrite(LED_BLUE_PIN, blue);
  }

  void set_status_code(StatusCode& code) {
    active_status_code = &code;
  }
}
