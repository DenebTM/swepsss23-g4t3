import { Response, Server } from 'miragejs'
import { _get } from '~/api/intercepts'
import { User } from '~/models/user'

import { AppSchema, EndpointReg } from '../mirageTypes'

/** URI for users routes */
export const USERS_URI = '/users'

/**
 * GET /api/users
 * @returns All users in the database
 */
export const getUsers = async (): Promise<User[]> => {
  return _get(USERS_URI)
}

/** Mocked users functions */
export const mockedUserReqs: EndpointReg = (server: Server) => {
  server.get(USERS_URI, (schema: AppSchema, request) => {
    const users = schema.all('user')
    return new Response(200, {}, users.models)
  })
}
