import { Timestamp } from './timestamp'

/**
 * A single log entry
 */
export interface AuditLogEntry {
  details: string
  level: LogLevel
  origin: LogEntity
  timestamp: Timestamp
}

/**
 * Severity warnings for an {@link AuditLogEntry}
 */
enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntity {
  ssID: string
  type: EntityType
}

/**
 * Entities involved in an {@link AuditLogEntry}
 */
enum EntityType {
  USER = 'USER',
  ACCESS_POINT = 'ACCESS_POINT',
  SENSOR_STATION = 'SENSOR_STATION',
}
