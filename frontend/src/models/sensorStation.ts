import { AccessPoint } from './accessPoint'
import { Measurement, SensorValues } from './measurement'
import { User } from './user'

/** Information about a single sensor station */
export interface SensorStation {
  id: number
  accessPoint: AccessPoint
  aggregationPeriod: number // Transmission interval in seconds
  gardeners: User[]
  lowerBound: SensorValues
  measurements: Measurement[]
  status: StationStatus
  upperBound: SensorValues
}

/** Possible status values for a {@link SensorStation} */
enum StationStatus {
  OK = 'OK',
  WARNING = 'WARNING',
  OFFLINE = 'OFFLINE',
}
