// based heavily on https://github.com/boschsensortec/Bosch-BSEC2-Library/blob/master/examples/generic_examples/basic/basic.ino

#include <sensors/bme.h>

namespace sensors::bme {
  void sensorCallback(const bme68xData data, const bsecOutputs outputs, Bsec2 bsec) {
    if (!outputs.nOutputs) {
      Serial.println("BME688 - Received callback but no data");
    }

    Serial.println("BME688 - Sensor data:");
    for (uint8_t i = 0; i < outputs.nOutputs; i++) {
      const bsecData output = outputs.output[i];
      switch (output.sensor_id) {
        case BSEC_OUTPUT_IAQ:
          Serial.println("  IAQ: " + String(output.signal));
          Serial.println("    (Accuracy status: " + String((int) output.accuracy) + ")");
          break;
        case BSEC_OUTPUT_RAW_TEMPERATURE:
          Serial.println("  Temperature: " + String(output.signal) + "°C");
          break;
        case BSEC_OUTPUT_RAW_PRESSURE:
          Serial.println("  Air Pressure: " + String(output.signal / 100) + " hPa");
          break;
        case BSEC_OUTPUT_RAW_HUMIDITY:
          Serial.println("  Humidity: " + String(output.signal) + "%");
          break;
        default:
          Serial.print("Other signal (");
          Serial.print(output.sensor_id, HEX);
          Serial.println("): " + String(output.signal));
      }
    } 
  }
}

bool sensors::bme::setup() {
  /* Desired subscription list of BSEC2 outputs */
  bsecSensor sensorList[] = {
    BSEC_OUTPUT_IAQ,
    BSEC_OUTPUT_RAW_TEMPERATURE,
    BSEC_OUTPUT_RAW_PRESSURE,
    BSEC_OUTPUT_RAW_HUMIDITY,
  };

  Wire.begin();
  if (!bsec.begin(BME68X_I2C_ADDR_HIGH, Wire)) {
    Serial.println("BME688 - Error initializing sensor: " + String(bsec.sensor.status));
    return false;
  }

  if (!bsec.updateSubscription(sensorList, ARRAY_LEN(sensorList), BSEC_SAMPLE_RATE_LP)) {
    Serial.println("BME688 - Error updating sensor data subscription: " + String(bsec.status));
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