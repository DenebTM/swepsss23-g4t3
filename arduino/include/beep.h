#ifndef SPEAKER_H
#define SPEAKER_H

#define BEEP_PIN          A3
#define BEEP_FREQ         440
#define BEEP_ON_DURATION  1000ms
#define BEEP_OFF_DURATION 1000ms

namespace beep {
  void start();
  void stop();
} // namespace beep

#endif
