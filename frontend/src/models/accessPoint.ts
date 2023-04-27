import { SensorStationUuid } from './sensorStation'
import { Timestamp } from './timestamp'

export type AccessPointId = number

/** Information about a single access point */
export interface AccessPoint {
  active: boolean
  lastUpdate: Timestamp
  apId: AccessPointId
  name: string
  sensorStations: SensorStationUuid[]
  serverAddress: string // IP address
}
