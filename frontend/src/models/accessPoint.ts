import { Timestamp } from './timestamp'

export type AccessPointId = number

/** Information about a single access point */
export interface AccessPoint {
  active: boolean
  lastUpdate: Timestamp
  apId: AccessPointId
  name: string
  serverAddress: string // IP address
}
