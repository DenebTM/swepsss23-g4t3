import { SensorStationUuid } from './sensorStation'
import { Timestamp } from './timestamp'

export type AccessPointId = string

/** Information about a single access point */
export interface AccessPoint {
  lastUpdate: Timestamp
  name: AccessPointId
  sensorStations: SensorStationUuid[]
  serverAddress: string // IP address
  status: ApStatus
}

/** Possible status values for an {@link AccessPoint} */
export enum ApStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  SEARCHING = 'SEARCHING',
  UNCONFIRMED = 'UNCONFIRMED',
}
