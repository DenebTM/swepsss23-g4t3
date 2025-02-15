import { Response, Server } from 'miragejs'
import { _delete, _post } from '~/api/intercepts'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'
import { AuthUserRole, Username } from '~/models/user'

import { AppSchema, EndpointReg } from '../../mirageTypes'
import { API_URI, notFound, success } from '../consts'

/**
 * Assign a gardener (by username) to a sensor station
 * GET /api/sensor-stations/{ssID}/gardeners/{username}
 */
export const assignGardener = async (
  sensorStationUuid: SensorStationUuid,
  username: Username
): Promise<SensorStation> =>
  _post(
    `${API_URI.sensorStations}/${sensorStationUuid}${API_URI.gardeners}/${username}`
  )

/**
 * DEL /api/sensor-stations/{ssID}/gardeners/{username}
 * Remove a gardener from a sensor station
 */
export const removeGardener = async (
  sensorStationUuid: SensorStationUuid,
  username: Username
): Promise<void> =>
  _delete(
    `${API_URI.sensorStations}/${sensorStationUuid}${API_URI.gardeners}/${username}`
  )

/** Path to update sensor station gardeners for mocked routes */
export const GARDENER_PATH = `${API_URI.sensorStations}/:ssID${API_URI.gardeners}/:username`

/** Mocked sensor station functions */
export const mockedSensorStationGardenerReqs: EndpointReg = (
  server: Server
) => {
  /** Mock {@link assignGardener} */
  server.post(GARDENER_PATH, (schema: AppSchema, request) => {
    const ssID: SensorStationUuid = Number(request.params.ssID)
    const username: Username = request.params.username

    // Check that user exists
    const user = schema.findBy('user', { username: username })

    if (!user) {
      return notFound(`user ${username}`)
    } else if (
      ![AuthUserRole.GARDENER, AuthUserRole.ADMIN].includes(user.attrs.userRole)
    ) {
      return new Response(
        400,
        {},
        'Can only assign gardeners and users to greenhouses'
      )
    }

    const sensorStation = schema.findBy('sensorStation', { ssID: ssID })

    if (sensorStation) {
      const oldGardeners: Username[] = sensorStation.attrs.gardeners
      sensorStation.update({
        gardeners: [username, ...oldGardeners],
      })
      return success(sensorStation.attrs)
    } else {
      return notFound(`sensor station ${ssID}`)
    }
  })

  /** Mock {@link removeGardener} */
  server.delete(GARDENER_PATH, (schema: AppSchema, request) => {
    const ssID: SensorStationUuid = Number(request.params.ssID)
    const username: Username = request.params.username
    const sensorStation = schema.findBy('sensorStation', { ssID: ssID })

    // Deliberately does not check if user was in the gardeners
    if (sensorStation) {
      const oldGardeners: Username[] = sensorStation.attrs.gardeners
      sensorStation.update({
        gardeners: oldGardeners.filter((g) => g !== username),
      })
      return success(sensorStation.attrs)
    } else {
      return notFound(`sensor station ${ssID}`)
    }
  })
}
