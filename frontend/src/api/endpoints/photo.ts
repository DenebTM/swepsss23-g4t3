import { faker } from '@faker-js/faker'
import { Server } from 'miragejs'
import { API_DEV_URL } from '~/common'
import { PhotoId } from '~/models/photo'

import { AppSchema, EndpointReg } from '../mirageTypes'
import { API_URI, success } from './consts'

/*
 * Photo to get a single photo by id
 */
export const getPhotoByIdUrl = (photoId: PhotoId): string =>
  `${API_DEV_URL}${API_URI.photos}/${photoId}`

/** Mocked sensor station functions relating to photos */
export const mockedPhotoReqs: EndpointReg = (server: Server) => {
  /** Mock response from {@link getPhotoByIdUrl} */
  server.get(`${API_URI.photos}/:photoId`, (schema: AppSchema, request) => {
    const fakePhotoUrl = faker.image.nature(
      faker.datatype.number({ min: 300, max: 900 }),
      faker.datatype.number({ min: 200, max: 600 }),
      true
    )

    return success(fakePhotoUrl)
  })
}
