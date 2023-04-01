import { Timestamp } from './timestamp'

export type AccessPointId = string

/** Information about a single access point */
export interface AccessPoint {
  active: boolean
  lastUpdate: Timestamp
  name: AccessPointId
  serverAddress: string // IP address
}
