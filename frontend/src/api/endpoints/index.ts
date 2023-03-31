import { faker } from '@faker-js/faker'
import { Server } from 'miragejs'
import { AppRegistry, Endpoints } from '~/api/mirageTypes'

import { ACCESS_POINTS, mockedAccessPointReqs } from './accessPoints'
import { mockedLoginEndpoints } from './login'
import {
  GARDENER_PATH,
  mockedSensorStationGardenerReqs,
} from './sensorStations/gardeners'
import {
  MEASUREMENT_PATH,
  mockedSensorStationMeasurementReqs,
} from './sensorStations/measurements'
import {
  mockedSensorStationReqs,
  SENSOR_STATIONS,
} from './sensorStations/sensorStations'
import { mockedUserReqs, USERS } from './user'

/** All endpoints mocked by mirage */
export const endpoints: Endpoints = {
  [USERS]: mockedUserReqs,
  [ACCESS_POINTS]: mockedAccessPointReqs,
  [SENSOR_STATIONS]: mockedSensorStationReqs,
  [GARDENER_PATH]: mockedSensorStationGardenerReqs,
  [MEASUREMENT_PATH]: mockedSensorStationMeasurementReqs,
}

/** Initialise all seed data used by mirage */
export const createSeedData = (
  server: Server<AppRegistry>
): Server<AppRegistry> => {
  // Create users who are not gardeners for any sensor station
  server.createList('user', faker.datatype.number({ min: 2, max: 5 }))

  // Create access points not attached to any sensor station
  server.createList('accessPoint', faker.datatype.number({ min: 0, max: 2 }))

  // Create sensor stations (and the associated gardeners, access points, and measurements)
  server.createList('sensorStation', faker.datatype.number({ min: 1, max: 3 }))

  return server
}

/** Endpoints for login and logout routes. Defined separately to other endpoints due to these routes not using the /api prefix. */
export const loginEndpoints: Endpoints = mockedLoginEndpoints
