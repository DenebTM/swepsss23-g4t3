import { Server } from 'miragejs'
import { _delete, _get, _put } from '~/api/intercepts'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'

import { AppSchema, EndpointReg } from '../../mirageTypes'
import { notFound, success } from '../helpers'

/** URI for sensor stations */
export const SENSOR_STATIONS_URI = '/sensor-stations'

/**
 * GET /api/sensor-stations
 * @returns All sensor stations in the database
 */
export const getSensorStations = async (): Promise<SensorStation[]> => {
  return _get(SENSOR_STATIONS_URI)
}

/**
 * GET /api/sensor-stations/${uuid}
 * Get a single sensor station by ID
 * @returns The fetched access point
 */
export const getSensorStation = async (
  sensorStationUuid: SensorStationUuid
): Promise<SensorStation> => {
  return _get(`${SENSOR_STATIONS_URI}/${sensorStationUuid}`)
}

/**
 * DEL /api/sensor-stations/${uuid}
 * Delete a single sensor station  by ID
 */
export const deleteSensorStation = async (
  sensorStationUuid: SensorStationUuid
): Promise<SensorStation> => {
  return _delete(`${SENSOR_STATIONS_URI}/${sensorStationUuid}`)
}

/**
 * PUT /api/sensor-stations/${uuid}
 * Update a single sensor station by ID
 */
export const updateSensorStation = async (
  sensorStationUuid: SensorStationUuid,
  newParams: Omit<Partial<SensorStation>, 'uuid'>
): Promise<SensorStation> => {
  return _put(`${SENSOR_STATIONS_URI}/${sensorStationUuid}`, newParams)
}

/** Path for mocked routes related to a single sensor station */
const sensorStationPath = `${SENSOR_STATIONS_URI}/:uuid`

/** Mocked sensor station functions */
export const mockedSensorStationReqs: EndpointReg = (server: Server) => {
  /** Mock {@link getSensorStations} */
  server.get(SENSOR_STATIONS_URI, (schema: AppSchema, request) => {
    const sensorStations = schema.all('sensorStation')
    return success(sensorStations.models)
  })

  /** Mock {@link getSensorStation} */
  server.get(sensorStationPath, (schema: AppSchema, request) => {
    const uuid: SensorStationUuid = Number(request.params.uuid)
    const sensorStation = schema.findBy('sensorStation', { uuid: uuid })

    return sensorStation
      ? sensorStation.attrs
      : notFound(`sensor station ${uuid}`)
  })

  /** Mock {@link deleteSensorStation} */
  server.delete(sensorStationPath, (schema: AppSchema, request) => {
    const uuid: SensorStationUuid = Number(request.params.uuid)
    const sensorStation = schema.findBy('sensorStation', { uuid: uuid })

    if (sensorStation) {
      sensorStation.destroy()
      return success()
    } else {
      return notFound(`sensor station ${uuid}`)
    }
  })

  /** Mock {@link updateSensorStation} */
  server.put(sensorStationPath, (schema: AppSchema, request) => {
    const uuid: SensorStationUuid = Number(request.params.uuid)
    const sensorStation = schema.findBy('sensorStation', { uuid: uuid })
    const newParams: Partial<SensorStation> = JSON.parse(request.requestBody)

    if (sensorStation) {
      sensorStation.update(newParams)
      return success()
    } else {
      return notFound(`sensor station ${uuid}`)
    }
  })
}
