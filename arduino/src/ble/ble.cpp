#include <ble/ble.h>
#include <ble/pairing.h>
#include <ble/sv_devinfo.h>
#include <ble/sv_envsense.h>
#include <ble/sv_senswarn.h>

#include <buttons.h>
#include <led.h>
#include <sensors/data.h>
#include <sensors/warn.h>

namespace ble {
  String paired_mac   = BLE_NO_PAIRED_DEVICE;
  bool is_advertising = false;

  void connect_event_handler(BLEDevice central) {
    String new_mac = central.address();

    // currently in pairing mode; pair with connecting access point
    // and clear currently active sensor warnings
    if (pairing::mode::active) {
      paired_mac = new_mac;

      Serial.print("Paired with access point: ");
      Serial.println(paired_mac);

      // clear all currently active warnings
      memset(&sensors::current_warnings, 0, sizeof sensors::current_warnings);

      pairing::mode::active = false;
      is_advertising        = false;
      led::clear_status_codes(led::CodePriority::HIGH);
    }

    // currently trying to reconnect to paired AP; reject unauthorized devices
    else {
      if (new_mac.equals(paired_mac)) {
        Serial.print("Reconnected to access point: ");
        Serial.println(paired_mac);

        is_advertising = false;
        led::clear_status_codes(led::CodePriority::HIGH);
      } else {
        Serial.print("Rejecting connection attempt from ");
        Serial.println(new_mac);

        central.disconnect();
      }
    }
  }

  void disconnect_event_handler(BLEDevice central) {
    is_advertising = true;
    BLE.advertise();

    if (central.address().equals(paired_mac)) {
      Serial.print("Lost connection with access point ");
      Serial.println(paired_mac);

      led::set_status_code(LEDC_BLE_DISCONNECTED, led::CodePriority::HIGH);
    }
  }

  bool setup() {
    if (!BLE.begin()) {
      Serial.println("Error initializing BLE!");
      return false;
    }

    devinfo_setup();
    envsense_setup();
    senswarn_setup();
    pairing::setup();

    BLE.setEventHandler(BLEConnected, connect_event_handler);
    BLE.setEventHandler(BLEDisconnected, disconnect_event_handler);

    return true;
  }

  void update() {
    // check for new BLE events (connect, disconnect, etc.)
    BLE.poll();

    // run timers etc
    devinfo_update();
    envsense_update();
    senswarn_update();
    pairing::update();
  }
} // namespace ble
