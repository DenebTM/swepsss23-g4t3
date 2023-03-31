import { Timestamp } from './timestamp'

/** Information about a single access point */
export interface AccessPoint {
  active: boolean
  lastUpdate: Timestamp
  name: string
  serverAddress: string // IP address
}
