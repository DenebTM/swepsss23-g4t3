import { Timestamp } from './timestamp'

type LogId = number

/**
 * A single log entry
 */
export interface LogEntry {
  id: LogId
  level: LogLevel
  message: string
  origin: LogEntity | null
  timestamp: Timestamp
}

/**
 * Severity warnings for an {@link LogEntry}
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

type LogEntityId = number | string

interface LogEntity {
  id: LogEntityId
  type: EntityType
}

/**
 * Entities involved in an {@link LogEntry}
 */
export enum EntityType {
  USER = 'USER',
  ACCESS_POINT = 'ACCESS_POINT',
  SENSOR_STATION = 'SENSOR_STATION',
}
