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
  BLEShortCharacteristic ch_temperature(BLE_UUID_TEMPERATURE, BLERead | BLENotify);
  BLEUnsignedShortCharacteristic ch_humidity(BLE_UUID_HUMIDITY, BLERead | BLENotify);
  BLECharacteristic ch_illuminance(BLE_UUID_ILLUMINANCE, BLERead | BLENotify, 3, true); // 3 bytes according to BLE ESS spec (why)
  BLEUnsignedShortCharacteristic ch_airQuality(BLE_UUID_AIR_QUALITY, BLERead | BLENotify);
  BLEUnsignedCharCharacteristic ch_soilMoisture(BLE_UUID_SOIL_MOISTURE, BLERead | BLENotify);

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
    sv_environmentalSensing.addCharacteristic(ch_airPressure);
    sv_environmentalSensing.addCharacteristic(ch_temperature);
    sv_environmentalSensing.addCharacteristic(ch_humidity);
    sv_environmentalSensing.addCharacteristic(ch_illuminance);
    sv_environmentalSensing.addCharacteristic(ch_airQuality);
    sv_environmentalSensing.addCharacteristic(ch_soilMoisture);

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


  /** convert values stored in `current_data` to correct data formats and transmit via BLE */
  void write_sensor_data() {
    // Sensor data format: float
    // BLE data format: unsigned 32-bit integer with resolution of 0.1 Pa
    uint32_t air_pressure = sensors::current_data.air_pressure * 10;
    ch_airPressure.writeValue(air_pressure);

    // Sensor data format: float
    // BLE data format: signed 16-bit integer with resolution of 0.01°C
    int16_t temperature = sensors::current_data.temperature * 100;
    ch_temperature.writeValue(temperature);

    // Sensor data format: float
    // BLE data format: unsigned 16-bit integer with resolution of 0.01%
    uint16_t humidity = sensors::current_data.humidity * 100;
    ch_humidity.writeValue(humidity);

    // Sensor data format: unsigned int
    // BLE data format: unsigned 24-bit integer with resolution of 0.01 lx
    struct uint24 { unsigned int data : 24; } illuminance = { .data = sensors::current_data.illuminance };
    ch_illuminance.writeValue((const void*)(&illuminance), 3);

    // Sensor data format: float
    // BLE data format: unsigned 16-bit integer with resolution of 1
    uint16_t air_quality = round(sensors::current_data.air_quality);
    ch_airQuality.writeValue(air_quality);

    // Sensor data format: unsigned 8-bit integer
    // BLE data format: unsigned 8-bit integer with resolution of 1%
    uint8_t soil_moisture = sensors::current_data.soil_moisture;
    ch_soilMoisture.writeValue(soil_moisture);
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

  if (ble::is_pairing && (millis() >= pairing_mode_timestamp + BLE_PAIRING_MODE_TIMEOUT_MS)) {
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
