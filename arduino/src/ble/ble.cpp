#include <ble/ble.h>
#include <ble/pairing.h>
#include <ble/sv_devinfo.h>
#include <ble/sv_envsense.h>

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
}


int ble::setup() {
  if (!BLE.begin()) {
    Serial.println("Error initializing BLE!");
  }

  devinfo_setup();
  envsense_setup();
  pairing::setup();

  BLE.setEventHandler(BLEConnected, connect_event_handler);
  BLE.setEventHandler(BLEDisconnected, disconnect_event_handler);

  return 0;
}

/**
 * intended to be run as part of the main loop
 * 
 * checks for new BLE device events and whether to enter or leave pairing mode
 */
void ble::update() {
  // check for new BLE events (connect, disconnect, etc.)
  BLE.poll();

  // run timers etc
  pairing::update();
  envsense_update();

  // log something to the Serial console once a second
  static unsigned long last_log_timestamp;
  unsigned long current_timestamp = millis();
  if (current_timestamp - last_log_timestamp >= 1000) {
    if (BLE.central().connected()) {
      uint8_t id = station_id();

      if (id != ble::val_stationID) {
        Serial.println("Station ID changed");
        ble::val_stationID = id;
        ble::ch_stationID.writeValue(ble::val_stationID);
      }
      Serial.print("Current station ID: ");
      Serial.println((unsigned long)ble::val_stationID);
    }

    last_log_timestamp = current_timestamp;
  }
}
