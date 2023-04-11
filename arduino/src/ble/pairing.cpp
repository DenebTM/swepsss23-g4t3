#include <ble/pairing.h>

#include <common.h>
#include <buttons.h>
#include <led.h>

#define PAIRING_MODE_TIMED_OUT (millis() >= mode::active_since + BLE_PAIRING_MODE_TIMEOUT_MS)

namespace ble::pairing {
  // runs on press of button 0; signals to enter pairing mode next time `update` is run
  void isr() {
    // don't enter pairing mode if already active
    if (pairing::mode::active) {
      return;
    }
    pairing::mode::entering = true;
  }

  namespace mode {
    // signal set by ISR; when true, will enter pairing mode at next call to `update`
    volatile bool entering = false;

    // whether or not pairing mode is currently active
    bool active = false;

    // when pairing mode was last entered; only valid while `active` is true
    timestamp_t active_since = 0;

    void enter() {
      paired_mac = BLE_NO_PAIRED_DEVICE;

      if (BLEDevice current_central = BLE.central()) {
        current_central.disconnect();
      }

      if (BLE.advertise()) {
        mode::active = true;
        mode::active_since = millis();
        led::set_color(led::BLUE); // TODO: define LED colors/status codes in a central location

        Serial.print("Ready to pair! Station address: ");
        Serial.println(BLE.address());
      } else {
        Serial.println("BLE advertising failed!");
      }
    }

    void exit() {
      Serial.println("Pairing timed out.");
      BLE.stopAdvertise();

      pairing::mode::active = false;
      led::set_color(led::RED); // TODO: define LED colors/status codes in a central location
    }
  }

  void setup() {
    buttons::setup(0, ble::pairing::isr);
    Serial.println("Press button 0 (rightmost) to begin pairing");
  }

  void update() {
    // button was pressed; enter pairing mode
    if (mode::entering) {
      mode::entering = false;
      mode::enter();
    }

    if (mode::active && PAIRING_MODE_TIMED_OUT) {
      mode::exit();
    }
  }
}
