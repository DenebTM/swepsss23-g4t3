// based heavily on
// https://github.com/boschsensortec/Bosch-BSEC2-Library/blob/master/examples/generic_examples/basic/basic.ino

#include <sensors/bme.h>
#include <sensors/data.h>

namespace sensors::bme {
  Bme68x sensor;
  Bsec2 bsec;

  void
  sensorCallback(const bme68xData data, const bsecOutputs outputs, Bsec2 bsec) {
    if (!outputs.nOutputs) {
      Serial.println("BME688 - Received callback but no data");
    }

    Serial.println("BME688 - Sensor data:");
    for (uint8_t i = 0; i < outputs.nOutputs; i++) {
      const bsecData output = outputs.output[i];
      switch (output.sensor_id) {
      case BSEC_OUTPUT_IAQ:
        sensors::current_data.air_quality = round(output.signal);
        Serial.println("  IAQ: " + String(output.signal));
        Serial.println("    (Accuracy status: " + String((int)output.accuracy) +
                       ")");
        break;
      case BSEC_OUTPUT_RAW_TEMPERATURE:
        sensors::current_data.temperature = output.signal * 100;
        Serial.println("  Temperature: " + String(output.signal) + "°C");
        break;
      case BSEC_OUTPUT_RAW_PRESSURE:
        sensors::current_data.air_pressure = output.signal * 10;
        Serial.println("  Air Pressure: " + String(output.signal / 100) +
                       " hPa");
        break;
      case BSEC_OUTPUT_RAW_HUMIDITY:
        sensors::current_data.humidity = output.signal * 100;
        Serial.println("  Humidity: " + String(output.signal) + "%");
        break;
      default:
        Serial.print("Other signal (");
        Serial.print(output.sensor_id, HEX);
        Serial.println("): " + String(output.signal));
      }
    }
  }
} // namespace sensors::bme

bool sensors::bme::setup() {
  // desired values from BSEC2 library
  bsecSensor sensorList[] = {
    BSEC_OUTPUT_IAQ,
    BSEC_OUTPUT_RAW_TEMPERATURE,
    BSEC_OUTPUT_RAW_PRESSURE,
    BSEC_OUTPUT_RAW_HUMIDITY,
  };

  Wire.begin();
  if (!bsec.begin(BME68X_I2C_ADDR_HIGH, Wire)) {
    Serial.println("BME688 - Error initializing sensor: " +
                   String(bsec.sensor.status));
    return false;
  }

  if (!bsec.updateSubscription(
          sensorList, ARRAY_LEN(sensorList), BSEC_SAMPLE_RATE_LP)) {
    Serial.println("BME688 - Error updating sensor data subscription: " +
                   String(bsec.status));
    return false;
  }

  bsec.attachCallback(sensorCallback);

  return true;
}

bool sensors::bme::update() {
  if (!bsec.run()) {
    Serial.println("BME688 - Sensor error: " + String(bsec.status));
    return false;
  }

  return true;
}
