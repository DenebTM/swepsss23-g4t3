import { accessPointFactory } from './accessPointFactory'
import { userFactory } from './user'

export * from './user'

/**
 * Factories used to generate fake data for the mock REST API
 */
export const factories = {
  user: userFactory,
  accessPoint: accessPointFactory,
}
