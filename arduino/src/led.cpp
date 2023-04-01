#include <led.h>

void led::setup() {
  pinMode(LED_RED_PIN, OUTPUT);
  pinMode(LED_GREEN_PIN, OUTPUT);
  pinMode(LED_BLUE_PIN, OUTPUT);
}

void led::set_color(Color color) {
  uint8_t red   = (color & 0xFF0000) >> 16;
  uint8_t green = (color & 0x00FF00) >>  8;
  uint8_t blue  = (color & 0x0000FF) >>  0;

  analogWrite(LED_RED_PIN, red);
  analogWrite(LED_GREEN_PIN, green);
  analogWrite(LED_BLUE_PIN, blue);

}
