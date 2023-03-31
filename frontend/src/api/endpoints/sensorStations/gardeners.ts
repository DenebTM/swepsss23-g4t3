import { Server } from 'miragejs'
import { _delete, _get, _post } from '~/api/intercepts'
import { SensorStationUuid } from '~/models/sensorStation'
import { Username, UserRole } from '~/models/user'

import { AppSchema, EndpointReg } from '../../mirageTypes'
import { notFound, success, unauthorised } from '../helpers'
import { SENSOR_STATIONS } from './sensorStations'

/** Part of URI path corresponding to sensor gardeners */
const GARDENERS = 'gardeners'

/**
 * Assign a gardener (by username) to a sensor station
 * GET /api/sensor-stations/{uuid}/gardeners/{username}
 */
export const assignGardener = async (
  sensorStationUuid: SensorStationUuid,
  username: Username
): Promise<void> => {
  return _post(
    `${SENSOR_STATIONS}/${sensorStationUuid}/${GARDENERS}/${username}`
  )
}

/**
 * DEL /api/sensor-stations/{uuid}/gardeners/{username}
 * Remove a gardener from a sensor station
 */
export const removeGardener = async (
  sensorStationUuid: SensorStationUuid,
  username: Username
): Promise<void> => {
  return _delete(
    `${SENSOR_STATIONS}/${sensorStationUuid}/${GARDENERS}/${username}`
  )
}

/** Path to update sensor station gardeners for mocked routes */
export const GARDENER_PATH = `${SENSOR_STATIONS}/:uuid/${GARDENERS}/:username`

/** Mocked sensor station functions */
export const mockedSensorStationGardenerReqs: EndpointReg = (
  server: Server
) => {
  /** Mock {@link assignGardener} */
  server.post(GARDENER_PATH, (schema: AppSchema, request) => {
    const uuid: SensorStationUuid = Number(request.params.uuid)
    const username: Username = request.params.username

    // Check that user exists
    const user = schema.findBy('user', { username: username })
    if (!user) {
      return notFound(`user ${username}`)
    } else if (![UserRole.GARDENER, UserRole.ADMIN].includes(user.attrs.role)) {
      return unauthorised()
    }

    const sensorStation = schema.findBy('sensorStation', { uuid: uuid })

    if (sensorStation) {
      const oldGardeners: Username[] = sensorStation.attrs.gardeners

      sensorStation.update({
        gardeners: [username, ...(oldGardeners as string[])],
      })
      return success(sensorStation)
    } else {
      return notFound(`sensor station ${uuid}`)
    }
  })

  /** Mock {@link removeGardener} */
  server.delete(GARDENER_PATH, (schema: AppSchema, request) => {
    const uuid: SensorStationUuid = Number(request.params.uuid)
    const username: Username = request.params.username
    const sensorStation = schema.findBy('sensorStation', { uuid: uuid })

    // Deliberately does not check if user was in the gardeners
    if (sensorStation) {
      const oldGardeners: unknown = sensorStation.attrs.gardeners
      if (Array.isArray(oldGardeners)) {
        sensorStation.update({
          gardeners: (oldGardeners as string[]).filter((g) => g !== username),
        })
      } else {
        sensorStation.update({ gardeners: [] })
      }
    }

    return notFound('sensor station gardener')
  })
}
