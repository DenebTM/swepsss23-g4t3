import { faker } from '@faker-js/faker'
import { Server } from 'miragejs'
import { AppRegistry, Endpoints } from '~/api/mirageTypes'

import { mockedAccessPointReqs } from './accessPoints'
import { API_URI } from './consts'
import { mockedLoginEndpoints } from './login'
import { mockedPhotoReqs } from './photo'
import {
  GARDENER_PATH,
  mockedSensorStationGardenerReqs,
} from './sensorStations/gardeners'
import {
  MEASUREMENT_PATH,
  mockedSensorStationMeasurementReqs,
} from './sensorStations/measurements'
import { mockedSensorStationPhotoReqs } from './sensorStations/photos'
import { mockedSensorStationReqs } from './sensorStations/sensorStations'
import { mockedUserReqs } from './user'

/** All endpoints eith /api prefix mocked by mirage */
export const endpoints: Endpoints = {
  [API_URI.users]: mockedUserReqs,
  [API_URI.accessPoints]: mockedAccessPointReqs,
  [API_URI.sensorStations]: mockedSensorStationReqs,
  [GARDENER_PATH]: mockedSensorStationGardenerReqs,
  [MEASUREMENT_PATH]: mockedSensorStationMeasurementReqs,
  [API_URI.photos]: mockedPhotoReqs,
}

/** Endpoints which do not use the /api prefix */
export const noPrefixEndpoints: Endpoints = {
  [`${API_URI.sensorStations}`]: mockedSensorStationPhotoReqs,
  ...mockedLoginEndpoints,
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
