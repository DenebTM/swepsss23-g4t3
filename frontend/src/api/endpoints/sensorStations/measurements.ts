//import dayjs from 'dayjs'
import { Server } from 'miragejs'
import { _delete, _get } from '~/api/intercepts'
import { Measurement } from '~/models/measurement'
import { SensorStationUuid } from '~/models/sensorStation'
import { Timestamp } from '~/models/timestamp'

import { AppSchema, EndpointReg } from '../../mirageTypes'
import { notFound, success } from '../helpers'
import { SENSOR_STATIONS_URI } from './sensorStations'

/** URI component for routes related to sensor station measurements */
const MEASUREMENTS_URI = 'measurements'

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
    `${SENSOR_STATIONS_URI}/${sensorStationUuid}/${MEASUREMENTS_URI}`,
    { params: { from: from, to: to } }
  )
}

/** Path to get sensor station measurements for mocked routes */
export const MEASUREMENT_PATH = `${SENSOR_STATIONS_URI}/:uuid/${MEASUREMENTS_URI}`

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
    //const body: { from?: Timestamp; to?: Timestamp } = request.queryParams

    if (sensorStation) {
      const ssMeasurements: Measurement[] = sensorStation.attrs.measurements

      return success(ssMeasurements.length > 0 ? ssMeasurements[0] : [])
    } else {
      return notFound(`sensor station ${uuid}`)
    }
    /*if (typeof body.from === 'undefined' && typeof body.to === 'undefined') {
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
    }*/
  })
}
