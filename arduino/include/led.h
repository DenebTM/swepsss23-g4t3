#ifndef _LED_H
#define _LED_H

#include <Arduino.h>
#include <chrono>
#include <tuple>
#include <vector>
using namespace std::chrono_literals;

#define LED_RED_PIN   A0
#define LED_GREEN_PIN A1
#define LED_BLUE_PIN  A2

// the brightness of the R, G and B components of our LED are different
#define LED_RED_MAX   255
#define LED_GREEN_MAX 80
#define LED_BLUE_MAX  80

#define LED_CYCLE_PAUSE_DURATION 2s

namespace led {
  // some predefined 24-bit colours in 0xRRGGBB format, with the different
  // brightness of each LED component pre-accounted for
  enum Color {
    OFF = 0,                                  // #000000
    RED = LED_RED_MAX << 16,                  // #ff0000
    GREEN = LED_GREEN_MAX << 8,               // #005000
    BLUE = LED_BLUE_MAX,                      // #000050
    YELLOW = RED | (LED_GREEN_MAX / 8) << 8,  // #ff0a00 (about as good of a yellow as I can get out of our LED)
    CYAN = BLUE | GREEN,                      // #005050
    PURPLE = RED | BLUE,                      // #ff0050
    WHITE = RED | GREEN | BLUE                // #ff5050
  };
  typedef std::chrono::milliseconds ColorDuration;
  typedef std::vector<std::pair<Color, ColorDuration>> StatusCode;

  void setup();

  void set_color(Color color);
  void set_status_code(StatusCode* const code);
  void set_status_codes(std::vector<StatusCode* const> new_codes);
}

#endif
