import { faker } from '@faker-js/faker'
import { Server } from 'miragejs'
import { _get } from '~/api/intercepts'
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

/*
 * Photo to get a single photo by id
 */
export const getPhotoByIdUrl = (photoId: PhotoId): string =>
  `${API_DEV_URL}${API_URI.photos}/${photoId}`

/** POST url to upload photos for a given sensor station */
export const uploadPhotosUrl = (sensorStationId: SensorStationUuid) =>
  `${API_DEV_URL}${API_URI.sensorStations}/${sensorStationId}${API_URI.photos}`

/** Route for mocking calls to an individual sensor station */
const mockedSensorStationRoute = `${API_URI.sensorStations}/:ssID`

/** Route for mocking calls related to photos for an individual sensor station */
const mockedSsPhotosRoute = `${mockedSensorStationRoute}${API_URI.photos}`

/** Mocked sensor station functions */
export const mockedSensorStationPhotoReqs: EndpointReg = (server: Server) => {
  /** Mock response from {@link getPhotoByIdUrl} */
  server.get(`${API_URI.photos}/:photoId`, (schema: AppSchema, request) => {
    const fakePhotoUrl = faker.image.nature(
      faker.datatype.number({ min: 300, max: 900 }),
      faker.datatype.number({ min: 200, max: 600 }),
      true
    )

    return success(fakePhotoUrl)
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
