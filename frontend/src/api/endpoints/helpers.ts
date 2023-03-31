import { Response } from 'miragejs'
import { _delete, _get } from '~/api/intercepts'

/** Return a {@link Response} with no headers, the given body, and a 200 success error code */
export const success = (body: object = {}): Response =>
  new Response(200, {}, body)

/** Return a {@link Response} with no headers, a message about the given entity, and a 404 not found error code */
export const notFound = (entity: string): Response =>
  new Response(404, {}, `${entity} not found`)
