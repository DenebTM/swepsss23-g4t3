#include <ble/sv_envsense.h>

#include <Ticker.h>

#include <common.h>
#include <sensors/data.h>

namespace ble {
  BLEService sv_envsense(BLE_UUID_ESS);
  BLEUnsignedIntCharacteristic ch_airPressure(BLE_UUID_AIR_PRESSURE, BLERead | BLENotify);
  BLEShortCharacteristic ch_temperature(BLE_UUID_TEMPERATURE, BLERead | BLENotify);
  BLEUnsignedShortCharacteristic ch_humidity(BLE_UUID_HUMIDITY, BLERead | BLENotify);
  BLECharacteristic ch_illuminance(BLE_UUID_ILLUMINANCE, BLERead | BLENotify, 3, true); // 3 bytes according to BLE ESS spec (why)
  BLEUnsignedShortCharacteristic ch_airQuality(BLE_UUID_AIR_QUALITY, BLERead | BLENotify);
  BLEUnsignedCharCharacteristic ch_soilMoisture(BLE_UUID_SOIL_MOISTURE, BLERead | BLENotify);

  // Periodic tasks
  Ticker write_sensor_data_timer(write_sensor_data, BLE_ENVSENSE_TRANSMIT_INTERVAL_MS);

  // set up environmental sensing service
  void envsense_setup() {
    CALL_FOREACH(sv_envsense.addCharacteristic,
      ch_airPressure, ch_temperature, ch_humidity, ch_illuminance, ch_airQuality, ch_soilMoisture)

    BLE.addService(sv_envsense);

    write_sensor_data_timer.start();
  }

  void envsense_update() {
    write_sensor_data_timer.update();
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
}
