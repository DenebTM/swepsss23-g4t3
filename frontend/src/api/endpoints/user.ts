import { Server } from 'miragejs'
import { _delete, _get } from '~/api/intercepts'
import { User, Username } from '~/models/user'

import { AppSchema, EndpointReg } from '../mirageTypes'
import { notFound, success } from './helpers'

/** URI for users routes */
export const USERS = '/users'

/**
 * GET /api/users
 * @returns All users in the database
 */
export const getUsers = async (): Promise<User[]> => {
  return _get(USERS)
}

/**
 * Get a single user by username
 * GET /api/users/${username}
 * @returns All users in the database
 */
export const getUser = async (username: Username): Promise<User> => {
  return _get(`${USERS}/${username}`)
}

/**
 * Delete a single user by username
 * DEL /api/users/${username}
 */
export const deleteUser = async (username: Username): Promise<void> => {
  return _delete(`${USERS}/${username}`)
}

/** Mocked users functions */
export const mockedUserReqs: EndpointReg = (server: Server) => {
  /** Mock {@link getUsers} */
  server.get(USERS, (schema: AppSchema, request) => {
    const users = schema.all('user')
    return success(users.models)
  })

  /** Mock {@link getUser} */
  server.get(`${USERS}/:username`, (schema: AppSchema, request) => {
    const username: Username = request.params.username
    const user = schema.findBy('user', { username: username })
    return user ? success(user.attrs) : notFound(`user ${username}`)
  })

  /** Mock {@link deleteUser} */
  server.delete(`${USERS}/:username`, (schema: AppSchema, request) => {
    const username: Username = request.params.username
    const user = schema.findBy('user', { username: username })
    if (user) {
      user.destroy()
      return success()
    } else {
      return notFound(`user ${username}`)
    }
  })
}
