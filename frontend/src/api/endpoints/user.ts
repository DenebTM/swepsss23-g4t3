import { Server } from 'miragejs'
import { _get } from '~/api/intercepts'
import { User } from '~/models/user'

import { AppSchema, EndpointReg } from '../mirageTypes'
import { success } from './helpers'

/** URI for users routes */
export const USERS = '/users'

/**
 * GET /api/users
 * @returns All users in the database
 */
export const getUsers = async (): Promise<User[]> => {
  return _get(USERS)
}

/** Mocked users functions */
export const mockedUserReqs: EndpointReg = (server: Server) => {
  /** Mock {@link getUsers} */
  server.get(USERS, (schema: AppSchema, request) => {
    const users = schema.all('user')
    return success(users.models)
  })
}
