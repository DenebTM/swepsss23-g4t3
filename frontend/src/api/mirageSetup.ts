import { faker } from '@faker-js/faker'
import { createServer, Response, Server } from 'miragejs'
import { API_DEV_URL } from '~/common'

import { endpoints, loginEndpoints } from './endpoints'
import { factories } from './mirageFactories'
import { models } from './mirageModels'
import { AppRegistry } from './mirageTypes'

export const MOCK_API = 'MOCK_API'

/*
 * Function to set up a mocked REST API server using Mirage.
 * Only works if environment variable NODE_ENV is true or if the argument enviroment is set to MOCK_API.
 * Source: https://stephencharlesweiss.com/miragejs-typescript-setup
 * Reads the desired environment
 */
export const mirageSetup = (
  environment = MOCK_API
): Server<AppRegistry> | undefined => {
  if (process.env.NODE_ENV !== 'mock-api' || environment !== MOCK_API) {
    return
  }

  const server = createServer({
    models,
    factories,
    seeds(server) {
      server.createList('user', faker.datatype.number({ min: 2, max: 18 }))
    },

    routes() {
      // Create login and logout routes separately due to htme not having the /api prefix
      this.post(`${API_DEV_URL}/handle-login`, () => new Response(200, {}))
    },
  })

  server.logging = true // Whether or not to log all requests
  server.urlPrefix = API_DEV_URL // Base URL

  // Register login routes
  for (const pathName in Object.keys(loginEndpoints)) {
    loginEndpoints[pathName](server)
  }

  // Register other internal endpoints
  server.namespace = 'api'
  for (const pathName in Object.keys(endpoints)) {
    endpoints[pathName](server)
  }

  // Reset config values for all other routes else
  server.namespace = ''
  server.passthrough()

  // Use the below for debugging
  // console.log({server})
  // console.log({ dump: server.db.dump() })

  return server
}
