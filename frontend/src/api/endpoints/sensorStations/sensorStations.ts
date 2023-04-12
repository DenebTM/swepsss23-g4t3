import { faker } from '@faker-js/faker'
import { Server } from 'miragejs'
import { _delete, _get, _put } from '~/api/intercepts'
import { Photo, PhotoId } from '~/models/photo'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'

import { AppSchema, EndpointReg } from '../../mirageTypes'
import { notFound, success } from '../helpers'

/** URI for sensor stations */
export const SENSOR_STATIONS_URI = '/sensor-stations'

/** URI for routes relating to both sensor stations and photos */
export const SS_PHOTOS_URI = '/photos'

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

/*
 * Get photos for a single sensor station
 */
export const getSensorStationPhotos = async (
  sensorStationUuid: SensorStationUuid
): Promise<Photo[]> => {
  return _get(`${SENSOR_STATIONS_URI}/${sensorStationUuid}${SS_PHOTOS_URI}`)
}

/** Route for mocking calls to an individual sensor station */
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
    `${mockedSensorStationRoute}${SS_PHOTOS_URI}`,
    (schema: AppSchema, request) => {
      const uuid: SensorStationUuid = Number(request.params.uuid)
      const sensorStation = schema.findBy('sensorStation', { uuid: uuid })

      if (sensorStation === null) {
        return notFound(`sensor station ${uuid}`)
      }

      // Generate a list of random URLs to example images
      const fakePhotoIds = faker.helpers.arrayElements([...Array(20).keys()])
      const fakePhotos: Photo[] = fakePhotoIds.map((photoId: PhotoId) => ({
        id: photoId,
        url: faker.image.nature(
          faker.datatype.number({ min: 300, max: 900 }),
          faker.datatype.number({ min: 200, max: 600 }),
          true
        ),
        uploaded: faker.date
          .between('2023-03-29T00:00:00.000Z', '2023-03-30T00:00:00.000Z')
          .toISOString(),
      }))

      return success(fakePhotos)
    }
  )

  /** Mock {@link updateSensorStation} */
  server.put(mockedSensorStationRoute, (schema: AppSchema, request) => {
    const uuid: SensorStationUuid = Number(request.params.uuid)
    const sensorStation = schema.findBy('sensorStation', { uuid: uuid })
    const newParams: Partial<SensorStation> = JSON.parse(request.requestBody)

    if (sensorStation) {
      sensorStation.update(newParams)
      return success(sensorStation.attrs)
    } else {
      return notFound(`sensor station ${uuid}`)
    }
  })
}
