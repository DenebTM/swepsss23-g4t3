import { Response, Server } from 'miragejs'
import { _get } from '~/api/intercepts'
import { User } from '~/models/user'

import { AppSchema } from '../mirageTypes'

/**
 * GET /api/users
 * @returns All users in the database
 */
export const getUsers = async (): Promise<User[]> => {
  return _get(`/users`)
}

/** Mocked users functions */
export const mockedUsers = (server: Server) => {
  server.get(`/users`, (schema: AppSchema, request) => {
    const users = schema.all('user')
    return new Response(200, {}, users.models)
  })
}
