import { faker } from '@faker-js/faker'
import { Server } from 'miragejs'
import { _delete, _get, _put } from '~/api/intercepts'
import { UPLOADED_PHOTO_KEY } from '~/common'
import { Photo, PhotoId } from '~/models/photo'
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
  newParams: Omit<Partial<SensorStation>, 'ssID'>
): Promise<SensorStation> => {
  return _put(`${API_URI.sensorStations}/${sensorStationUuid}`, newParams)
}

/*
 * Get photos for a single sensor station
 */
export const getSensorStationPhotos = async (
  sensorStationUuid: SensorStationUuid
): Promise<Photo[]> => {
  return _get(`${API_URI.sensorStations}/${sensorStationUuid}${API_URI.photos}`)
}

/** Route for mocking calls to an individual sensor station */
const mockedSensorStationRoute = `${API_URI.sensorStations}/:ssID`

/** Route for mocking calls related to photos for an individual sensor station */
const mockedSsPhotosRoute = `${mockedSensorStationRoute}${API_URI.photos}`

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

  /** Mock {@link getSensorStationPhotos} */
  server.get(mockedSsPhotosRoute, (schema: AppSchema, request) => {
    const ssID: SensorStationUuid = Number(request.params.ssID)
    const sensorStation = schema.findBy('sensorStation', { ssID: ssID })

    if (sensorStation === null) {
      return notFound(`sensor station ${ssID}`)
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

  /** Mock uploading a photo */
  server.post(mockedSsPhotosRoute, (schema: AppSchema, request) => {
    const ssID: SensorStationUuid = Number(request.params.ssID)
    const sensorStation = schema.findBy('sensorStation', { ssID: ssID })
    if (sensorStation) {
      const formData: FormData = request.requestBody as unknown as FormData
      const uploadFile: File = formData.get(UPLOADED_PHOTO_KEY) as File

      // Return the file in the success for now. qqjf TODO update photo models
      return success(uploadFile)
    } else {
      return notFound(`sensor station ${ssID}`)
    }
  })
}
