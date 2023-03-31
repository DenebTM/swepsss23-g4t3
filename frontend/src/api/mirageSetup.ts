import { createServer, Server } from 'miragejs'
import { API_DEV_URL } from '~/common'

import { createSeedData, endpoints, loginEndpoints } from './endpoints'
import { factories } from './mirageFactories'
import { models } from './mirageModels'
import { AppRegistry } from './mirageTypes'

/** Parameter telling {@link mirageSetup} to mock the API if passed as an argument. */
export const MOCK_API = 'MOCK_API'

/**
 * Function to set up a mocked REST API server using Mirage.
 * Only works if environment variable NODE_ENV is true or if the argument enviroment is set to {@link MOCK_API}.
 * Source: https://stephencharlesweiss.com/miragejs-typescript-setup
 * Reads the desired environment
 */
export const mirageSetup = (
  environment = MOCK_API
): Server<AppRegistry> | undefined => {
  if (process.env.NODE_ENV !== 'mock-api' && environment !== MOCK_API) {
    return
  }

  const server = createServer({
    models,
    factories,
    seeds: createSeedData,
  })

  server.logging = true // Whether or not to log all requests
  server.urlPrefix = API_DEV_URL // Base URL

  // Register internal endpoints with /api namespace
  server.namespace = 'api'
  Object.values(endpoints).map((route) => route(server))

  // Register other routes
  server.namespace = ''
  Object.values(loginEndpoints).map((route) => route(server))

  // Allow all other requests to pass through mirage
  server.passthrough()

  // Use the below for debugging
  // console.log({ server })
  // console.log({ dump: server.db.dump() })

  return server
}
