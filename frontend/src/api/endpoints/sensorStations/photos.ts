import { faker } from '@faker-js/faker'
import { Server } from 'miragejs'
import { _delete, _get } from '~/api/intercepts'
import { API_DEV_URL, UPLOADED_PHOTO_KEY } from '~/common'
import { Photo, PhotoId } from '~/models/photo'
import { SensorStationUuid } from '~/models/sensorStation'

import { AppSchema, EndpointReg } from '../../mirageTypes'
import { API_URI, notFound, success } from '../consts'

/*
 * Get photos for a single sensor station
 */
export const getSensorStationPhotos = async (
  sensorStationUuid: SensorStationUuid
): Promise<Photo[]> =>
  _get(
    `${API_URI.sensorStations}/${sensorStationUuid}${API_URI.photos}`,
    undefined,
    false
  )

/**
 * DEL /api/photos/${photoId}
 * Delete a single photo by ID
 */
export const deletePhoto = async (
  ssID: SensorStationUuid,
  photoId: PhotoId
): Promise<void> =>
  _delete(`${API_URI.sensorStations}/${ssID}${API_URI.photos}/${photoId}`)

/** POST url to upload photos for a given sensor station */
export const uploadPhotosUrl = (sensorStationId: SensorStationUuid) =>
  `${API_DEV_URL}${API_URI.sensorStations}/${sensorStationId}${API_URI.photos}`

/** Route for mocking calls to an individual sensor station */
const mockedSensorStationRoute = `${API_URI.sensorStations}/:ssID`

/** Route for mocking calls related to photos for an individual sensor station */
const mockedSsPhotosRoute = `${mockedSensorStationRoute}${API_URI.photos}`

/** Mocked sensor station functions */
export const mockedSensorStationPhotoReqs: EndpointReg = (server: Server) => {
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
      uploaded: faker.date
        .between('2023-03-29T00:00:00.000Z', '2023-03-30T00:00:00.000Z')
        .toISOString(),
    }))

    return success(fakePhotos)
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

  /** Mock {@link deletePhoto} */
  server.delete(mockedSsPhotosRoute, (schema: AppSchema, request) => {
    // Hard-code a success for now
    return success('Photo deleted')
  })
}
