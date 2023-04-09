#include <ble/pairing.h>

#include <buttons.h>
#include <led.h>

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
    volatile bool entering = false;
    bool active = false;
    unsigned long timestamp = 0;

    void enter() {
      paired_mac = BLE_NO_PAIRED_DEVICE;
      if (BLEDevice current_central = BLE.central()) {
        current_central.disconnect();
      }

      if (BLE.advertise()) {
        Serial.print("Ready to pair! Station address: ");
        Serial.println(BLE.address());

        led::set_color(led::BLUE);
      } else {
        Serial.println("BLE advertising failed!");
      }
    }

    void exit() {
      Serial.println("Pairing timed out.");
      pairing::mode::active = false;
      BLE.stopAdvertise();

      led::set_color(led::RED);
    }
  }

  void setup() {
    buttons::setup(0, ble::pairing::isr);
    Serial.println("Press button 0 (rightmost) to begin pairing");
  }

  void update() {
    // button was pressed; enter pairing mode
    if (mode::entering) {
      mode::active = true;
      mode::entering = false;
      mode::timestamp = millis();
      mode::enter();
    }

    if (mode::active && (millis() >= mode::timestamp + BLE_PAIRING_MODE_TIMEOUT_MS)) {
      mode::exit();
    }
  }
}
