#include <Arduino.h>

#include <ble.h>
#include <buttons.h>
#include <led.h>
#include <station_id.h>

namespace ble {
  // Device information
  BLEService sv_devinfo("180a");
  BLEStringCharacteristic ch_manufacturer("2a29", BLERead, strlen(BLE_DEVICE_MANUFACTURER));

  // Services
  // [to be added]

  // Characteristics
  BLEByteCharacteristic ch_stationID("f001", BLERead | BLENotify);

  uint8_t val_stationID = 0;
  unsigned long last_update_timestamp = 0;
  unsigned long pairing_mode_timestamp = 0;
  volatile bool entering_pairing_mode = false;

  void devinfo_setup() {
    BLE.setAppearance(BLE_DEVICE_APPEARANCE);
    BLE.setDeviceName(BLE_DEVICE_NAME);
    BLE.setLocalName(BLE_DEVICE_NAME);

    ble::ch_manufacturer.writeValue(BLE_DEVICE_MANUFACTURER);
    ble::sv_devinfo.addCharacteristic(ble::ch_manufacturer);

    ble::val_stationID = station_id();
    ble::ch_stationID.writeValue(ble::val_stationID);
    ble::sv_devinfo.addCharacteristic(ble::ch_stationID);

    BLE.addService(ble::sv_devinfo);

    BLE.setAdvertisedService(ble::sv_devinfo);
    BLE.setAdvertisedServiceData(0x180a, &ble::val_stationID, 1);
  }

  void connect_handler(BLEDevice central) {
    String new_mac = central.address();

    // currently pairing; remember connecting access point
    if (is_pairing) {
      paired_mac = central.address();

      Serial.print("Paired with access point: ");
      Serial.println(paired_mac);

      is_pairing = false;
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

  void disconnect_handler(BLEDevice central) {
    String new_mac = central.address();

    if (new_mac.equals(paired_mac)) {
      Serial.print("Lost connection with access point ");
      Serial.println(paired_mac);

      led::set_color(led::YELLOW);
    }
  }

  void pair_isr() {
    // rudimentary de-bounce
    if (is_pairing) {
      return;
    }
    entering_pairing_mode = true;
  }

  void enter_pairing_mode() {
    ble::paired_mac = String("");
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

  void exit_pairing_mode() {
    Serial.println("Pairing timed out.");
    ble::is_pairing = false;
    BLE.stopAdvertise();

    led::set_color(led::RED);
  }
}


int ble::setup() {
  if (!BLE.begin()) {
    Serial.println("Error initializing BLE!");
  }

  buttons::setup(0, ble::pair_isr);
  Serial.println("Press button 0 (rightmost) to begin pairing");

  ble::devinfo_setup();

  BLE.setEventHandler(BLEConnected, ble::connect_handler);
  BLE.setEventHandler(BLEDisconnected, ble::disconnect_handler);

  return 0;
}

void ble::update() {
  if (ble::entering_pairing_mode) {
    ble::is_pairing = true;
    ble::entering_pairing_mode = false;
    ble::pairing_mode_timestamp = millis();
    ble::enter_pairing_mode();
  }

  if (ble::is_pairing && (millis() >= ble::pairing_mode_timestamp + PAIRING_MODE_TIMEOUT_MSEC)) {
    ble::exit_pairing_mode();
  }

  BLE.poll();

  unsigned long new_timestamp = millis();
  if (new_timestamp - ble::last_update_timestamp >= 1000) {
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

    ble::last_update_timestamp = new_timestamp;
  }
}
