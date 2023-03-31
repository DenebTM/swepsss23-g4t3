import { Server } from 'miragejs'
import { _delete, _get } from '~/api/intercepts'
import { AccessPoint, AccessPointId } from '~/models/accessPoint'

import { AppSchema, EndpointReg } from '../mirageTypes'
import { notFound, success } from './helpers'

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

/**
 * DEL /api/access-points/${accessPointId}
 * Delete a single access point by ID
 */
export const deleteAccessPoint = async (
  accessPointId: AccessPointId
): Promise<void> => {
  return _delete(`${ACCESS_POINTS}/${accessPointId}`)
}

/** Mocked access point functions */
export const mockedAccessPointReqs: EndpointReg = (server: Server) => {
  /** Mock {@link getAccessPoints} */
  server.get(ACCESS_POINTS, (schema: AppSchema, request) => {
    const accessPoints = schema.all('accessPoint')
    return success(accessPoints.models)
  })

  /** Mock {@link getAccessPoint} */
  server.get(`${ACCESS_POINTS}/:name`, (schema: AppSchema, request) => {
    const apName: AccessPointId = request.params.name
    const accessPoint = schema.findBy('accessPoint', { name: apName })

    return accessPoint ? accessPoint.attrs : notFound(`access point ${apName}`)
  })

  /** Mock {@link deleteAccessPoint} */
  server.delete(`${ACCESS_POINTS}/:name`, (schema: AppSchema, request) => {
    const apName: AccessPointId = request.params.name
    const accessPoint = schema.findBy('accessPoint', { name: apName })
    if (accessPoint) {
      accessPoint.destroy()
      return success()
    } else {
      return notFound(`access point ${apName}`)
    }
  })
}
