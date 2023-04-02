import { AccessPointId } from './accessPoint'
import { Measurement, SensorValues } from './measurement'
import { Username } from './user'

/** The UUID of a sensor station */
export type SensorStationUuid = number

/** Information about a single sensor station */
export interface SensorStation {
  uuid: SensorStationUuid
  accessPoint: AccessPointId
  aggregationPeriod: number // Transmission interval in seconds
  gardeners: Username[]
  lowerBound: SensorValues
  measurements: Measurement[]
  status: StationStatus
  upperBound: SensorValues
}

/** Possible status values for a {@link SensorStation} */
export enum StationStatus {
  OK = 'OK',
  WARNING = 'WARNING',
  OFFLINE = 'OFFLINE',
}
