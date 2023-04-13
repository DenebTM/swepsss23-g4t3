import { Server } from 'miragejs'
import { _delete, _get } from '~/api/intercepts'
import { PhotoId } from '~/models/photo'
import { SensorStation } from '~/models/sensorStation'

import { AppSchema, EndpointReg } from '../mirageTypes'
import { success } from './helpers'

/** URI for sensor station photos */
export const PHOTOS_URI = '/photos'

/**
 * DEL /api/photos/${photoId}
 * Delete a single photo by ID
 */
export const deletePhoto = async (photoId: PhotoId): Promise<SensorStation> => {
  return _delete(`${PHOTOS_URI}/${photoId}`)
}

/** Mocked sensor station functions relating to photos */
export const mockedPhotoReqs: EndpointReg = (server: Server) => {
  /** Mock {@link deleteAccessPoint} */
  server.delete(`${PHOTOS_URI}/:photoId`, (schema: AppSchema, request) => {
    //const photoId: PhotoId = Number(request.params.photoId)
    // Hard-code a success for now. Photos could be moved into the database later if required.
    return success('Photo deleted')
  })
}
