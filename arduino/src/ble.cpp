#include <ble.h>
#include <buttons.h>
#include <led.h>
#include <station_id.h>
#include <sensors/data.h>
#include <Ticker.h>

namespace ble {
  // Device information service
  BLEService sv_devinfo(BLE_UUID_DEVINFO);
  BLEStringCharacteristic ch_manufacturer(BLE_UUID_MANUFACTURER_NAME,
                                          BLERead,
                                          strlen(BLE_DEVICE_MANUFACTURER));
  BLEByteCharacteristic ch_stationID(BLE_UUID_STATION_ID, BLERead | BLENotify);
  uint8_t val_stationID = station_id();

  // Environmental sensing service
  BLEService sv_environmentalSensing(BLE_UUID_ESS);
  BLEUnsignedIntCharacteristic ch_airPressure(BLE_UUID_AIR_PRESSURE, BLERead | BLENotify);

  // runtime values received via BLE
  // [TODO: add]

  static volatile bool is_pairing = false;

  // set up how the sensor station appears to other BLE devices
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

    // include current station ID in BLE advertising data
    BLE.setAdvertisedService(ble::sv_devinfo);
    BLE.setAdvertisedServiceData(strtol(BLE_UUID_DEVINFO, NULL, 16),
                                 &ble::val_stationID, 1);
  }

  // set up environmental sensing service
  void ess_setup() {
    ch_airPressure.writeValue(0);
    sv_environmentalSensing.addCharacteristic(ch_airPressure);

    BLE.addService(sv_environmentalSensing);
  }

  void connect_event_handler(BLEDevice central) {
    String new_mac = central.address();

    // currently in pairing mode; pair with connecting access point
    if (is_pairing) {
      paired_mac = new_mac;

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

  void disconnect_event_handler(BLEDevice central) {
    String new_mac = central.address();

    if (new_mac.equals(paired_mac)) {
      Serial.print("Lost connection with access point ");
      Serial.println(paired_mac);

      led::set_color(led::YELLOW);
    }
  }


  /// Pairing mode
  unsigned long pairing_mode_timestamp = 0;
  volatile bool entering_pairing_mode = false;

  // runs on press of button 0; signals to enter pairing mode next time `update` is run
  void pair_isr() {
    // rudimentary de-bounce
    if (is_pairing) {
      return;
    }
    entering_pairing_mode = true;
  }

  void enter_pairing_mode() {
    ble::paired_mac = BLE_NO_PAIRED_DEVICE;
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


  // Sensor data transmission
  void write_sensor_data() {
    // Sensor data format: float
    // BLE data format: unsigned 32-bit integer with resolution of 0.1Pa
    uint32_t val = sensors::current_data.air_pressure * 10;
    ch_airPressure.writeValue(val);
  }
  

  // Periodic tasks
  Ticker write_sensor_data_timer(write_sensor_data, BLE_TRANSMIT_INTERVAL_MS);
}


int ble::setup() {
  if (!BLE.begin()) {
    Serial.println("Error initializing BLE!");
  }

  buttons::setup(0, ble::pair_isr);
  Serial.println("Press button 0 (rightmost) to begin pairing");

  ble::devinfo_setup();
  ble::ess_setup();

  BLE.setEventHandler(BLEConnected, ble::connect_event_handler);
  BLE.setEventHandler(BLEDisconnected, ble::disconnect_event_handler);

  ble::write_sensor_data_timer.start();

  return 0;
}

/**
 * intended to be run as part of the main loop
 * 
 * checks for new BLE device events and whether to enter or leave pairing mode
 */
void ble::update() {
  if (ble::entering_pairing_mode) {
    ble::is_pairing = true;
    ble::entering_pairing_mode = false;
    ble::pairing_mode_timestamp = millis();
    ble::enter_pairing_mode();
  }

  if (ble::is_pairing && (millis() >= pairing_mode_timestamp + BLE_PAIRING_MODE_TIMEOUT_MSEC)) {
    ble::exit_pairing_mode();
  }

  // check for new BLE events (connect, disconnect, etc.)
  BLE.poll();

  // run timers
  ble::write_sensor_data_timer.update();

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
