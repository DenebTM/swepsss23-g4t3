import { Server } from 'miragejs'

import { mockedLoginEndpoints } from './login'
import { mockedUsers } from './user'

/** All endpoints mocked by mirage */
export const endpoints: { [key: string]: (server: Server) => void } = {
  users: mockedUsers,
}

/** Endpoints for login and logiout routes. Defined separately to other endpoints due to not needing the /api base. */
export const loginEndpoints: { [key: string]: (server: Server) => void } =
  mockedLoginEndpoints
