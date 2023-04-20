#ifndef _COMMON_H
#define _COMMON_H

typedef unsigned long timestamp_t;

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
