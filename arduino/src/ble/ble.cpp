#include <ble/ble.h>
#include <ble/pairing.h>
#include <ble/sv_devinfo.h>
#include <ble/sv_envsense.h>
#include <ble/sv_senswarn.h>

#include <buttons.h>
#include <led.h>
#include <sensors/data.h>

namespace ble {
  String paired_mac = BLE_NO_PAIRED_DEVICE;

  void connect_event_handler(BLEDevice central) {
    String new_mac = central.address();

    // currently in pairing mode; pair with connecting access point
    if (pairing::mode::active) {
      paired_mac = new_mac;

      Serial.print("Paired with access point: ");
      Serial.println(paired_mac);

      pairing::mode::active = false;
      led::clear_status_codes(led::CodePriority::HIGH);
    }

    // currently trying to reconnect to paired AP; reject unauthorized devices
    else {
      if (new_mac.equals(paired_mac)) {
        Serial.print("Reconnected to access point: ");
        Serial.println(paired_mac);

        led::clear_status_codes(led::CodePriority::HIGH);
      } else {
        Serial.print("Rejecting connection attempt from ");
        Serial.println(new_mac);

        central.disconnect();
      }
    }
  }

  void disconnect_event_handler(BLEDevice central) {
    String new_mac = central.address();

    if (new_mac.equals(paired_mac)) {
      Serial.print("Lost connection with access point ");
      Serial.println(paired_mac);

      led::set_status_code(LEDC_BLE_DISCONNECTED, led::CodePriority::HIGH);
    }
  }


  int setup() {
    if (!BLE.begin()) {
      Serial.println("Error initializing BLE!");
    }

    devinfo_setup();
    envsense_setup();
    senswarn_setup();
    pairing::setup();

    BLE.setEventHandler(BLEConnected, connect_event_handler);
    BLE.setEventHandler(BLEDisconnected, disconnect_event_handler);

    return 0;
  }

  void update() {
    // check for new BLE events (connect, disconnect, etc.)
    BLE.poll();

    // run timers etc
    devinfo_update();
    envsense_update();
    pairing::update();
  }
}
