import { Response } from 'miragejs'

/** Return a {@link Response} with no headers, the given body, and a 200 success error code */
export const success = (body: object | string = {}): Response =>
  new Response(200, {}, body)

/** Return a {@link Response} with no headers, a message about the given entity, and a 404 not found error code */
export const notFound = (entity: string): Response =>
  new Response(404, {}, `${entity} not found`)

/** Return a {@link Response} with no headers, a message about the given entity, and a 401 unauthorised code */
export const unauthorised = (message?: string): Response =>
  new Response(401, {}, message ?? 'Unauthorised')

/** Paths for backend URIs */
export const API_URI = {
  accessPoints: '/access-points',
  gardeners: '/gardeners',
  measurements: '/measurements',
  photos: '/photos',
  sensorStations: '/sensor-stations',
  users: '/users',
}
