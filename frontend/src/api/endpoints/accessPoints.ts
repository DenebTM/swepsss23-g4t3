import { Response, Server } from 'miragejs'
import { _get } from '~/api/intercepts'
import { AccessPoint, AccessPointId } from '~/models/accessPoint'

import { AppSchema, EndpointReg } from '../mirageTypes'

/** URI for access points */
export const ACCESS_POINTS = '/access-points'

/**
 * GET /api/access-points
 * @returns All access points in the database
 */
export const getAccessPoints = async (): Promise<AccessPoint[]> => {
  return _get(ACCESS_POINTS)
}

/**
 * GET /api/access-points/${accessPointId}
 * Get a single access point by ID
 * @returns The fetched access point
 */
export const getAccessPoint = async (
  accessPointId: AccessPointId
): Promise<AccessPoint> => {
  return _get(`${ACCESS_POINTS}/${accessPointId}`)
}

/** Mocked access point functions */
export const mockedAccessPointReqs: EndpointReg = (server: Server) => {
  server.get(ACCESS_POINTS, (schema: AppSchema, request) => {
    const accessPoints = schema.all('accessPoint')
    return new Response(200, {}, accessPoints.models)
  })
}
