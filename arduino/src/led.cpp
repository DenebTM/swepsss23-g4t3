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

    bg_thread.start(bg_thread_func);
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

  void bg_thread_func() {
    active_status_code = new StatusCode{{ Color::RED, 500ms }, { Color::OFF, 200ms }};

    while (true) {
      if (!active_status_code) {
        rtos::ThisThread::yield();
        continue;
      }

      for (auto tup : *active_status_code) {
        const auto duration = std::get<ColorDurationMsec>(tup);
        auto next_update = rtos::Kernel::Clock::now() + duration;

        const auto color = std::get<Color>(tup);
        set_color(color);

        rtos::ThisThread::sleep_until(next_update);
      }
    }
  }
}
