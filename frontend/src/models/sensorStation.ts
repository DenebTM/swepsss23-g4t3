import { AccessPointId } from './accessPoint'
import { Measurement, SensorValues } from './measurement'
import { Username } from './user'

/** The UUID of a sensor station */
export type SensorStationUuid = number

/** Information about a single sensor station */
export interface SensorStation {
  ssID: SensorStationUuid
  apName: AccessPointId
  aggregationPeriod: number // Transmission interval in seconds
  gardeners: Username[]
  lowerBound: SensorValues
  currentMeasurement: Measurement | null
  measurements: Measurement[]
  status: StationStatus
  upperBound: SensorValues
}

/** Possible status values for a {@link SensorStation} */
export enum StationStatus {
  OK = 'OK',
  WARNING = 'WARNING',
  OFFLINE = 'OFFLINE',
  AVAILABLE = 'AVAILABLE',
  PAIRING = 'PAIRING',
  PAIRING_FAILED = 'PAIRING_FAILED',
}
