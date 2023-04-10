import { Timestamp } from './timestamp'

/** The unique identifier of a sensor station measurement */
export type MeasurementId = number

/**
 * A single measurement from a sensor station
 */
export interface Measurement {
  id: MeasurementId
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
