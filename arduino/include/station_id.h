#define ID_DIP_START_PIN 5

static inline uint8_t station_id() {
  uint8_t id = 0;
  for (int i = 0; i < 8; i++) {
    id |= (digitalRead(ID_DIP_START_PIN + i) << i);
  }

  return id;
}