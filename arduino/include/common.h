#ifndef _COMMON_H
#define _COMMON_H

typedef unsigned long timestamp_t;

/**
 * call the same function (or compatible macro) taking a single argument with six different arguments
 * (lmao)
 */
#define CALL_FOREACH(call, arg1, arg2, arg3, arg4, arg5, arg6) \
  call(arg1); call(arg2); call(arg3); call(arg4); call(arg5); call(arg6);

struct uint24 {
  unsigned int data : 24;

  uint24() {
    data = 0;
  }
  uint24(unsigned int newdata) {
    data = newdata;
  }
};

#endif
