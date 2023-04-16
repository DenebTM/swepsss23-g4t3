import { Server } from 'miragejs'
import { _delete, _get, _put } from '~/api/intercepts'
import { User, Username } from '~/models/user'

import { AppSchema, EndpointReg } from '../mirageTypes'
import { API_URI, notFound, success } from './consts'

/**
 * GET /api/users
 * @returns All users in the database
 */
export const getUsers = async (): Promise<User[]> => {
  return _get(API_URI.users)
}

/**
 * Get a single user by username
 * GET /api/users/${username}
 * @returns All users in the database
 */
export const getUser = async (username: Username): Promise<User> => {
  return _get(`${API_URI.users}/${username}`)
}

/**
 * Update a single user by username
 * PUT /api/users/${username}
 * @returns The updated user
 */
export const updateUser = async (
  username: Username,
  updatedUser: Partial<User>
): Promise<User> => {
  return _put(`${API_URI.users}/${username}`, { ...updatedUser })
}

/**
 * Delete a single user by username
 * DEL /api/users/${username}
 */
export const deleteUser = async (username: Username): Promise<void> => {
  return _delete(`${API_URI.users}/${username}`)
}

/** Constant for mocking routes related to a single user */
const singleUserRoute = `${API_URI.users}/:username`

/** Mocked users functions */
export const mockedUserReqs: EndpointReg = (server: Server) => {
  /** Mock {@link getUsers} */
  server.get(API_URI.users, (schema: AppSchema, request) => {
    const users = schema.all('user')
    return success(users.models)
  })

  /** Mock {@link getUser} */
  server.get(singleUserRoute, (schema: AppSchema, request) => {
    const username: Username = request.params.username
    const user = schema.findBy('user', { username: username })
    return user ? success(user.attrs) : notFound(`user ${username}`)
  })

  /** Mock {@link deleteUser} */
  server.delete(singleUserRoute, (schema: AppSchema, request) => {
    const username: Username = request.params.username
    const user = schema.findBy('user', { username: username })
    if (user) {
      user.destroy()
      return success()
    } else {
      return notFound(`user ${username}`)
    }
  })

  /** Mock {@link updateUser} */
  server.put(singleUserRoute, (schema: AppSchema, request) => {
    const username: Username = request.params.username

    const user = schema.findBy('user', { username: username })
    if (user) {
      const body: Partial<User> = JSON.parse(request.requestBody)
      user.update(body)
      return success(user.attrs)
    } else {
      return notFound(`user ${username}`)
    }
  })
}
