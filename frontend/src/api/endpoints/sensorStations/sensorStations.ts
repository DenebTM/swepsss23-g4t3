import { faker } from '@faker-js/faker'
import { Server } from 'miragejs'
import { _delete, _get } from '~/api/intercepts'
import { Image } from '~/models/image'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'

import { AppSchema, EndpointReg } from '../../mirageTypes'
import { notFound, success } from '../helpers'

/** URI for sensor stations */
export const SENSOR_STATIONS_URI = '/sensor-stations'

/** URI for sensor station photos */
export const PHOTOS_URI = '/photos'

/**
 * GET /api/sensor-stations
 * @returns All sensor stations in the database
 */
export const getSensorStations = async (): Promise<SensorStation[]> => {
  return _get(SENSOR_STATIONS_URI)
}

/**
 * GET /api/sensor-stations/${uuid}
 * Get a single access point by ID
 * @returns The fetched access point
 */
export const getSensorStation = async (
  sensorStationUuid: SensorStationUuid
): Promise<SensorStation> => {
  return _get(`${SENSOR_STATIONS_URI}/${sensorStationUuid}`)
}

/**
 * DEL /api/sensor-stations/${uuid}
 * Delete a single access point by ID
 */
export const deleteSensorStation = async (
  sensorStationUuid: SensorStationUuid
): Promise<SensorStation> => {
  return _delete(`${SENSOR_STATIONS_URI}/${sensorStationUuid}`)
}

/**
 * Get photos for a single sensor station
 */
export const getSensorStationPhotos = async (
  sensorStationUuid: SensorStationUuid
): Promise<Image[]> => {
  return _get(`${SENSOR_STATIONS_URI}/${sensorStationUuid}${PHOTOS_URI}`)
}

/** Roue for mocking calls to an individual sensor station */
const mockedSensorStationRoute = `${SENSOR_STATIONS_URI}/:uuid`

/** Mocked sensor station functions */
export const mockedSensorStationReqs: EndpointReg = (server: Server) => {
  /** Mock {@link getSensorStations} */
  server.get(SENSOR_STATIONS_URI, (schema: AppSchema, request) => {
    const sensorStations = schema.all('sensorStation')
    return success(sensorStations.models)
  })

  /** Mock {@link getSensorStation} */
  server.get(mockedSensorStationRoute, (schema: AppSchema, request) => {
    const uuid: SensorStationUuid = Number(request.params.uuid)
    const sensorStation = schema.findBy('sensorStation', { uuid: uuid })

    return sensorStation
      ? sensorStation.attrs
      : notFound(`sensor station ${uuid}`)
  })

  /** Mock {@link deleteSensorStation} */
  server.delete(mockedSensorStationRoute, (schema: AppSchema, request) => {
    const uuid: SensorStationUuid = Number(request.params.uuid)
    const sensorStation = schema.findBy('sensorStation', { uuid: uuid })

    if (sensorStation) {
      sensorStation.destroy()
      return success()
    } else {
      return notFound(`sensor station ${uuid}`)
    }
  })

  /** Mock {@link getSensorStationPhotos} */
  server.get(
    `${mockedSensorStationRoute}${PHOTOS_URI}`,
    (schema: AppSchema, request) => {
      const uuid: SensorStationUuid = Number(request.params.uuid)
      const sensorStation = schema.findBy('sensorStation', { uuid: uuid })

      if (sensorStation === null) {
        return notFound(`sensor station ${uuid}`)
      }

      // Generate a list of random URLs to example images
      const fakeImages: Image[] = []
      for (let i = 0; i < faker.datatype.number({ min: 0, max: 15 }); i++) {
        fakeImages.push(
          faker.image.nature(
            faker.datatype.number({ min: 300, max: 900 }),
            faker.datatype.number({ min: 200, max: 600 }),
            true
          )
        )
      }

      return success(fakeImages)
    }
  )
}
