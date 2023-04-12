import { Server } from 'miragejs'
import { _delete, _get, _put } from '~/api/intercepts'
import { AccessPoint, AccessPointId } from '~/models/accessPoint'

import { AppSchema, EndpointReg } from '../mirageTypes'
import { notFound, success } from './helpers'

/** URI for access points */
export const ACCESS_POINTS_URI = '/access-points'

/**
 * GET /api/access-points
 * @returns All access points in the database
 */
export const getAccessPoints = async (): Promise<AccessPoint[]> =>
  _get(ACCESS_POINTS_URI)

/**
 * GET /api/access-points/${accessPointId}
 * Get a single access point by ID
 * @returns The fetched access point
 */
export const getAccessPoint = async (
  accessPointId: AccessPointId
): Promise<AccessPoint> => _get(`${ACCESS_POINTS_URI}/${accessPointId}`)

/**
 * DEL /api/access-points/${accessPointId}
 * Delete a single access point by ID
 */
export const deleteAccessPoint = async (
  accessPointId: AccessPointId
): Promise<void> => _delete(`${ACCESS_POINTS_URI}/${accessPointId}`)

/**
 * PUT /api/access-points/${accessPointId}
 * Update a single access point by id
 */
export const updateAccessPoint = async (
  accessPointId: AccessPointId,
  updatedAp: Omit<Partial<AccessPoint>, 'id'>
): Promise<AccessPoint> =>
  _put(`${ACCESS_POINTS_URI}/${accessPointId}`, { ...updatedAp })

/** Constant for mocking routes related to a single access point */
const singleApRoute = `${ACCESS_POINTS_URI}/:id`

/** Mocked access point functions */
export const mockedAccessPointReqs: EndpointReg = (server: Server) => {
  /** Mock {@link getAccessPoints} */
  server.get(ACCESS_POINTS_URI, (schema: AppSchema, request) => {
    const accessPoints = schema.all('accessPoint')
    return success(accessPoints.models)
  })

  /** Mock {@link getAccessPoint} */
  server.get(singleApRoute, (schema: AppSchema, request) => {
    const apId: AccessPointId = Number(request.params.id)
    const accessPoint = schema.findBy('accessPoint', { apId: apId })

    return accessPoint ? accessPoint.attrs : notFound(`access point ${apId}`)
  })

  /** Mock {@link deleteAccessPoint} */
  server.delete(singleApRoute, (schema: AppSchema, request) => {
    const apId: AccessPointId = Number(request.params.id)
    const accessPoint = schema.findBy('accessPoint', { apId: apId })
    if (accessPoint) {
      accessPoint.destroy()
      return success()
    } else {
      return notFound(`access point ${apId}`)
    }
  })

  /** Mock {@link updateAccessPoint} */
  server.put(singleApRoute, (schema: AppSchema, request) => {
    const apId: AccessPointId = Number(request.params.id)
    const accessPoint = schema.findBy('accessPoint', { apId: apId })
    if (accessPoint) {
      const body: Partial<AccessPoint> = JSON.parse(request.requestBody)
      accessPoint.update(body)
      return success(accessPoint.attrs)
    } else {
      return notFound(`access point ${apId}`)
    }
  })
}
