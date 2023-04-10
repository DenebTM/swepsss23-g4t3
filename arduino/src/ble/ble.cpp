#include <ble/ble.h>
#include <ble/pairing.h>
#include <ble/sv_devinfo.h>
#include <ble/sv_envsense.h>
#include <ble/sv_senswarn.h>

#include <buttons.h>
#include <led.h>
#include <station_id.h>
#include <sensors/data.h>
#include <Ticker.h>

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
      led::set_color(led::GREEN);
    }

    // currently trying to reconnect to paired AP; reject unauthorized devices
    else {
      if (new_mac.equals(paired_mac)) {
        Serial.print("Reconnected to access point: ");
        Serial.println(paired_mac);

        led::set_color(led::GREEN);
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

      led::set_color(led::YELLOW);
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
    envsense_update();
    pairing::update();

    // log something to the Serial console once a second
    static unsigned long last_log_timestamp;
    unsigned long current_timestamp = millis();
    if (current_timestamp - last_log_timestamp >= 1000) {
      if (BLE.central().connected()) {
        uint8_t id = station_id();

        if (id != val_stationID) {
          Serial.println("Station ID changed");
          val_stationID = id;
          ch_stationID.writeValue(val_stationID);
        }
        Serial.print("Current station ID: ");
        Serial.println((unsigned long)val_stationID);
      }

      last_log_timestamp = current_timestamp;
    }
  }
}
