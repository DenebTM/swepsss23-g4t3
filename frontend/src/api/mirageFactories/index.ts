import {
  Assign,
  FactoryDefinition,
  FlattenFactoryMethods,
} from 'miragejs/-types'

import { accessPointFactory } from './accessPointFactory'
import { logEntryFactory } from './logEntryFactory'
import { measurementFactory, sensorValuesFactory } from './measurementFactory'
import { sensorStationFactory } from './sensorStationFactory'
import { userFactory } from './user'

/**
 * Factories used to generate fake data for the mock REST API
 */
export const factories: {
  [key: string]: FactoryDefinition<
    Assign<
      object,
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      FlattenFactoryMethods<any>
    >
  >
} = {
  user: userFactory,
  accessPoint: accessPointFactory,
  measurement: measurementFactory,
  sensorStation: sensorStationFactory,
  sensorValue: sensorValuesFactory,
  logEntry: logEntryFactory,
}
