#ifndef _HWTIMER_H
#define _HWTIMER_H

#include <Arduino.h>

namespace hwtimer {
  bool attach_isr(unsigned int interval_ms, voidFuncPtr callback);
}

#endif
