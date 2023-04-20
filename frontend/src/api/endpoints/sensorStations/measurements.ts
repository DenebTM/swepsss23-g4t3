import dayjs from 'dayjs'
import { Server } from 'miragejs'
import { _delete, _get } from '~/api/intercepts'
import { Measurement } from '~/models/measurement'
import { SensorStationUuid } from '~/models/sensorStation'
import { Timestamp } from '~/models/timestamp'

import { AppSchema, EndpointReg } from '../../mirageTypes'
import { API_URI, notFound, success } from '../consts'

/**
 * GET /api/sensor-stations/{uuid}/measurements
 * @returns The current
 */
export const getSensorStationMeasurements = async (
  sensorStationUuid: SensorStationUuid,
  from?: Timestamp,
  to?: Timestamp
): Promise<Measurement[]> => {
  return _get(
    `${API_URI.sensorStations}/${sensorStationUuid}${API_URI.measurements}`,
    { params: { from: from, to: to } }
  )
}

/** Path to get sensor station measurements for mocked routes */
export const MEASUREMENT_PATH = `${API_URI.sensorStations}/:uuid${API_URI.measurements}`

/** Mocked sensor station functions */
export const mockedSensorStationMeasurementReqs: EndpointReg = (
  server: Server
) => {
  /**
   * Mock {@link getSensorStationMeasurements}.
   * Currently does not implement filters as the timestamps in measurements are random.
   */
  server.get(MEASUREMENT_PATH, (schema: AppSchema, request) => {
    const uuid: SensorStationUuid = Number(request.params.uuid)
    const sensorStation = schema.findBy('sensorStation', { uuid: uuid })
    const body: { from?: Timestamp; to?: Timestamp } = request.queryParams

    if (sensorStation) {
      const ssMeasurements: Measurement[] = sensorStation.attrs.measurements

      if (typeof body.from === 'undefined' && typeof body.to === 'undefined') {
        // Return the first measurement if there is one
        return success(ssMeasurements.length > 0 ? [ssMeasurements[0]] : [])
      } else {
        return success(
          ssMeasurements.filter(
            (m) =>
              ((typeof body.from === 'undefined' ||
                dayjs(m.timestamp).isAfter(body.from)) &&
                typeof body.to === 'undefined') ||
              dayjs(m.timestamp).isBefore(body.to)
          )
        )
      }
    } else {
      return notFound(`sensor station ${uuid}`)
    }
  })
}
