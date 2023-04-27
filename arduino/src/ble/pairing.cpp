#include <ble/pairing.h>

#include <common.h>
#include <buttons.h>
#include <led.h>

#define PAIRING_MODE_TIMED_OUT (millis() >= mode::active_since + BLE_PAIRING_MODE_TIMEOUT_MS)

namespace ble::pairing {
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
        led::set_status_code(LEDC_BLE_PAIRING);

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
      led::set_status_code(LEDC_BLE_UNPAIRED);
    }
  }

  void setup() {
    buttons::setup(BUTTON_ID_BLE_PAIRING, []() {
      // reset timeout (so that pairing mode duration can be extended while already active)
      mode::active_since = millis();

      // only enter pairing mode if not already active
      if (pairing::mode::active) return;
      pairing::mode::entering = true;
    });

    Serial.println("Press button 0 (rightmost) to begin pairing");
    led::set_status_code(LEDC_BLE_UNPAIRED);
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
