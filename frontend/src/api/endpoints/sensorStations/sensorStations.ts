import { Server } from 'miragejs'
import { _delete, _get } from '~/api/intercepts'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'

import { AppSchema, EndpointReg } from '../../mirageTypes'
import { notFound, success } from '../helpers'

/** URI for sensor stations */
export const SENSOR_STATIONS = '/sensor-stations'

/**
 * GET /api/sensor-stations
 * @returns All sensor stations in the database
 */
export const getSensorStations = async (): Promise<SensorStation[]> => {
  return _get(SENSOR_STATIONS)
}

/**
 * GET /api/sensor-stations/${uuid}
 * Get a single access point by ID
 * @returns The fetched access point
 */
export const getSensorStation = async (
  sensorStationUuid: SensorStationUuid
): Promise<SensorStation> => {
  return _get(`${SENSOR_STATIONS}/${sensorStationUuid}`)
}

/**
 * DEL /api/sensor-stations/${uuid}
 * Delete a single access point by ID
 */
export const deleteSensorStation = async (
  sensorStationUuid: SensorStationUuid
): Promise<SensorStation> => {
  return _delete(`${SENSOR_STATIONS}/${sensorStationUuid}`)
}

/** Mocked sensor station functions */
export const mockedSensorStationReqs: EndpointReg = (server: Server) => {
  /** Mock {@link getSensorStations} */
  server.get(SENSOR_STATIONS, (schema: AppSchema, request) => {
    const sensorStations = schema.all('sensorStation')
    return success(sensorStations.models)
  })

  /** Mock {@link getSensorStation} */
  server.get(`${SENSOR_STATIONS}/:uuid`, (schema: AppSchema, request) => {
    const uuid: SensorStationUuid = Number(request.params.uuid)
    const sensorStation = schema.findBy('sensorStation', { uuid: uuid })

    return sensorStation
      ? sensorStation.attrs
      : notFound(`sensor station ${uuid}`)
  })

  /** Mock {@link deleteSensorStation} */
  server.delete(`${SENSOR_STATIONS}/:uuid`, (schema: AppSchema, request) => {
    const uuid: SensorStationUuid = Number(request.params.uuid)
    const sensorStation = schema.findBy('sensorStation', { uuid: uuid })

    if (sensorStation) {
      sensorStation.destroy()
      return success()
    } else {
      return notFound(`sensor station ${uuid}`)
    }
  })
}
