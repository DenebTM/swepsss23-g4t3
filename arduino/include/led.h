#ifndef _LED_H
#define _LED_H

#include <Arduino.h>

#define LED_RED_PIN   A0
#define LED_GREEN_PIN A1
#define LED_BLUE_PIN  A2
#define LED_RED_MAX   255
#define LED_GREEN_MAX 80
#define LED_BLUE_MAX  80

namespace led {
  enum Color {
    OFF = 0,
    RED = LED_RED_MAX << 16,
    GREEN = LED_GREEN_MAX << 8,
    BLUE = LED_BLUE_MAX,
    YELLOW = RED | GREEN,
    CYAN = BLUE | GREEN,
    PURPLE = RED | BLUE,
    WHITE = RED | GREEN | BLUE
  };

  void setup();

  void set_color(Color color);
}


#endif