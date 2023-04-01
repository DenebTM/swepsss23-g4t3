#include <sensors/bme.h>

void bme_i2c_delay(uint32_t period_us, void *intf_ptr) {
	delayMicroseconds(period_us);
}

bool sensors::bme::setup() {
  Wire.begin();
  
  // Try to initialize communication with the sensor
  sensor.begin(0x77, Wire, bme_i2c_delay);
  if (int8_t sensorStatus = sensor.checkStatus()) {
    if (sensorStatus == BME68X_ERROR) {
      Serial.println("BME688 error: " + sensor.statusString());
      return false;
    }
  }

  // setup sensor as in https://github.com/boschsensortec/Bosch-BME68x-Library/blob/master/examples/sequential_mode/sequential_mode.ino
  // (whatever the example does here is probably reasonable for us to do)
  // Initialize temperature, pressure and humidity sensors with default configuration
  sensor.setTPH();

  /// Set sensor pre-heating profile
  // Heater temperature in °C
  uint16_t tempProf[] = { 100, 200, 320 };
  // Heating duration in milliseconds
	uint16_t durProf[] = { 150, 150, 150 };
  sensor.setHeaterProf(tempProf, durProf, 3);

  sensor.setSeqSleep(BME68X_ODR_250_MS);

  Serial.println("BME688 initialized successfully!");
  return true;
}

bool sensors::bme::read() {
  bme68xData data;

  sensor.setOpMode(BME68X_FORCED_MODE);
	delayMicroseconds(sensor.getMeasDur());

	if (sensor.fetchData()) {
    while (sensor.getData(data) > 0); // make sure all data has been read
    
    Serial.println("\nBME688 sensor data\n==============================");
    Serial.println("Temperature: " + String(data.temperature) + "°C");
    Serial.println("Pressure: " + String(data.pressure / 100) + " hPa");
    Serial.println("Humidity: " + String(data.humidity) + "%");
    Serial.println("Gas resistance: " + String(data.gas_resistance / 1000) + " kOhm");
    Serial.println("Sensor status: " + String(data.status, HEX));

    return true;
	}
  
  return false;
}