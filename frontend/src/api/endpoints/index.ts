import { Endpoints } from '~/api/mirageTypes'

import { mockedLoginEndpoints } from './login'
import { mockedUsers } from './user'

/** All endpoints mocked by mirage */
export const endpoints: Endpoints = {
  users: mockedUsers,
}

/** Endpoints for login and logout routes. Defined separately to other endpoints due to these routes not using the /api prefix. */
export const loginEndpoints: Endpoints = mockedLoginEndpoints
