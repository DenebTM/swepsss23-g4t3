import {
  Assign,
  FactoryDefinition,
  FlattenFactoryMethods,
} from 'miragejs/-types'

import { accessPointFactory } from './accessPointFactory'
import { measurementFactory, sensorValuesFactory } from './measurementFactory'
import { sensorStationFactory } from './sensorStationFactory'
import { userFactory } from './user'

export * from './user'

/**
 * Factories used to generate fake data for the mock REST API
 */
export const factories: {
  [key: string]: FactoryDefinition<Assign<object, FlattenFactoryMethods<any>>>
} = {
  user: userFactory,
  accessPoint: accessPointFactory,
  measurement: measurementFactory,
  sensorStation: sensorStationFactory,
  sensorValue: sensorValuesFactory,
}
