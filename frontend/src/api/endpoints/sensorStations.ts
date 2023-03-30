import { Response, Server } from 'miragejs'
import { _get } from '~/api/intercepts'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'

import { AppSchema, EndpointReg } from '../mirageTypes'

/** URI for access points */
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
export const getAccessPoint = async (
  sensorStationUuid: SensorStationUuid
): Promise<SensorStation> => {
  return _get(`${SENSOR_STATIONS}/${sensorStationUuid}`)
}

/** Mocked sensor station functions */
export const mockedSensorStationReqs: EndpointReg = (server: Server) => {
  server.get(SENSOR_STATIONS, (schema: AppSchema, request) => {
    const sensorStations = schema.all('sensorStation')
    return new Response(200, {}, sensorStations.models)
  })
}
