import { Server } from 'miragejs'
import { _get } from '~/api/intercepts'
import { LogEntry, LogLevel } from '~/models/log'
import { Timestamp } from '~/models/timestamp'

import { AppSchema, EndpointReg } from '../mirageTypes'
import { API_URI, success } from './consts'

/**
 * GET /api/logs
 * @returns A list of log entries
 */
export const getLogs = async (params?: {
  level?: LogLevel
  from?: Timestamp
  to?: Timestamp
}): Promise<LogEntry[]> => _get(API_URI.logs, { params: params })

/** Mocked log functions */
export const mockedLogReqs: EndpointReg = (server: Server) => {
  /** Mock {@link getLogs} */
  server.get(API_URI.logs, (schema: AppSchema, request) => {
    const logs = schema.all('logEntry')

    // qqjf TODO add filtering
    return success(logs.models)
  })
}
