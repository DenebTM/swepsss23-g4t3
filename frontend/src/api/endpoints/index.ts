import { faker } from '@faker-js/faker'
import { Server } from 'miragejs'
import { AppRegistry, Endpoints } from '~/api/mirageTypes'

import { mockedAccessPointReqs } from './accessPoints'
import { mockedLoginEndpoints } from './login'
import { mockedUserReqs } from './user'

/** All endpoints mocked by mirage */
export const endpoints: Endpoints = {
  users: mockedUserReqs,
  'access-points': mockedAccessPointReqs,
}

/** Initialise all seed data used by mirage */
export const createSeedData = (server: Server): Server<AppRegistry> => {
  server.createList('user', faker.datatype.number({ min: 2, max: 18 }))
  server.createList('accessPoint', faker.datatype.number({ min: 1, max: 3 }))

  return server
}

/** Endpoints for login and logout routes. Defined separately to other endpoints due to these routes not using the /api prefix. */
export const loginEndpoints: Endpoints = mockedLoginEndpoints
