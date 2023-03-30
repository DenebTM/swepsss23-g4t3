import { Timestamp } from './timestamp'

/**
 * A single measurement from a sensor station
 */
export interface Measurement {
  data: SensorValues
  timestamp: Timestamp
}

/**
 * An object containng the values in a {@link Measurement}
 */
export interface SensorValues {
  airPressure: number
  airQuality: number
  humidity: number
  lightIntensity: number
  soilMoisture: number
  temperature: number
}
