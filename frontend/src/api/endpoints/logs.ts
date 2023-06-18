import { Server } from 'miragejs'
import { _get } from '~/api/intercepts'
import { EntityType, LogEntry, LogLevel } from '~/models/log'
import { Timestamp } from '~/models/timestamp'

import { AppSchema, EndpointReg } from '../mirageTypes'
import { API_URI, success } from './consts'

/**
 * GET /api/logs
 * @returns A list of log entries
 *
 * Call with {} to return all (including Spring-internal) logs
 */
export const getLogs = async (
  params: {
    level?: LogLevel | LogLevel[]
    from?: Timestamp
    to?: Timestamp
    origin?: EntityType | 'any' // "any" means "not null"
  } = {
    origin: 'any',
  }
): Promise<LogEntry[]> =>
  _get(API_URI.logs, {
    params,
    paramsSerializer: { indexes: null }, // pass level as "level" instead of "level[]"
  })

/** Mocked log functions. Note that filtering is not implemented. */
export const mockedLogReqs: EndpointReg = (server: Server) => {
  /** Mock {@link getLogs} */
  server.get(API_URI.logs, (schema: AppSchema, request) => {
    const logs = schema.all('logEntry')

    return success(logs.models)
  })
}
