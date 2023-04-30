#ifndef _STATION_ID_H
#define _STATION_ID_H

#include <Arduino.h>
#include <cstddef>

#define ID_DIP_START_PIN 5

static uint8_t station_id() {
  uint8_t id = 0;

  // read DIP switch attached to pins 5-12
  for (int i = 0; i < 8; i++) {
    id |= (digitalRead(ID_DIP_START_PIN + i) << i);
  }

  return id;
}

#endif
