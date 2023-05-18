import { Server } from 'miragejs'
import { _delete, _get, _put } from '~/api/intercepts'
import { SensorValues } from '~/models/measurement'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'

import { AppSchema, EndpointReg } from '../../mirageTypes'
import { API_URI, notFound, success } from '../consts'

/**
 * GET /api/sensor-stations
 * @returns All sensor stations in the database
 */
export const getSensorStations = async (): Promise<SensorStation[]> => {
  return _get(API_URI.sensorStations)
}

/**
 * GET /api/sensor-stations/${ssID}
 * Get a single sensor station by ID
 * @returns The fetched access point
 */
export const getSensorStation = async (
  sensorStationUuid: SensorStationUuid
): Promise<SensorStation> => {
  return _get(`${API_URI.sensorStations}/${sensorStationUuid}`)
}

/**
 * DEL /api/sensor-stations/${ssID}
 * Delete a single sensor station  by ID
 */
export const deleteSensorStation = async (
  sensorStationUuid: SensorStationUuid
): Promise<SensorStation> => {
  return _delete(`${API_URI.sensorStations}/${sensorStationUuid}`)
}

/**
 * PUT /api/sensor-stations/${ssID}
 * Update a single sensor station by ID
 */
export const updateSensorStation = async (
  sensorStationUuid: SensorStationUuid,
  newParams: Omit<
    Partial<SensorStation>,
    'ssID' | 'upperBound' | 'lowerBound'
  > &
    Partial<{
      lowerBound: Partial<SensorValues>
      upperBound: Partial<SensorValues>
    }>
): Promise<SensorStation> => {
  return _put(`${API_URI.sensorStations}/${sensorStationUuid}`, newParams)
}

/** Route for mocking calls to an individual sensor station */
const mockedSensorStationRoute = `${API_URI.sensorStations}/:ssID`

/** Mocked sensor station functions */
export const mockedSensorStationReqs: EndpointReg = (server: Server) => {
  /** Mock {@link getSensorStations} */
  server.get(API_URI.sensorStations, (schema: AppSchema, request) => {
    const sensorStations = schema.all('sensorStation')
    return success(sensorStations.models)
  })

  /** Mock {@link getSensorStation} */
  server.get(mockedSensorStationRoute, (schema: AppSchema, request) => {
    const ssID: SensorStationUuid = Number(request.params.ssID)
    const sensorStation = schema.findBy('sensorStation', { ssID: ssID })

    return sensorStation
      ? sensorStation.attrs
      : notFound(`sensor station ${ssID}`)
  })

  /** Mock {@link deleteSensorStation} */
  server.delete(mockedSensorStationRoute, (schema: AppSchema, request) => {
    const ssID: SensorStationUuid = Number(request.params.ssID)
    const sensorStation = schema.findBy('sensorStation', { ssID: ssID })

    if (sensorStation) {
      sensorStation.destroy()
      return success()
    } else {
      return notFound(`sensor station ${ssID}`)
    }
  })

  /** Mock {@link updateSensorStation} */
  server.put(mockedSensorStationRoute, (schema: AppSchema, request) => {
    const ssID: SensorStationUuid = Number(request.params.ssID)
    const sensorStation = schema.findBy('sensorStation', { ssID: ssID })
    const newParams: Partial<SensorStation> = JSON.parse(request.requestBody)

    if (sensorStation) {
      sensorStation.update(newParams)
      return success(sensorStation.attrs)
    } else {
      return notFound(`sensor station ${ssID}`)
    }
  })
}
