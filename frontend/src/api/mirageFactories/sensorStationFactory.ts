import { faker } from '@faker-js/faker'
import { Factory, ModelInstance, Server } from 'miragejs'
import { AccessPoint } from '~/models/accessPoint'
import { Measurement, SensorValues } from '~/models/measurement'
import { SensorStation, StationStatus } from '~/models/sensorStation'
import { AuthUserRole, Username } from '~/models/user'

import { AfterCreate, AppRegistry } from '../mirageTypes'

/**
 * Factory to generate a fake {@link SensorStation}.
 * Properties requiring relations (corresponding to the ommitted keys) should be called when generating seed data.
 * See: https://miragejs.com/docs/main-concepts/factories/
 */
export const sensorStationFactory = Factory.extend<
  Omit<
    SensorStation,
    'accessPoint' | 'gardeners' | 'lowerBound' | 'measurements' | 'upperBound'
  > &
    AfterCreate<SensorStation>
>({
  uuid(i: number) {
    return i
  },
  aggregationPeriod() {
    return faker.datatype.number({
      min: 0.2,
      max: 600,
      precision: 0.1,
    })
  },
  status() {
    return faker.helpers.arrayElement(Object.values(StationStatus))
  },

  // Create the following attributes via factory methods after intial creation
  afterCreate(
    sensorStation: ModelInstance<SensorStation>,
    server: Server<AppRegistry>
  ) {
    // Create gardeners
    const nGardeners = faker.datatype.number({ min: 0, max: 3 })
    const gardenerIds: Username[] = []
    for (let i = 0; i <= nGardeners; i++) {
      const userId = faker.name.middleName().toLowerCase()
      gardenerIds.push(userId)
      server.create('user', { username: userId, role: AuthUserRole.GARDENER })
    }

    // Create bound objects
    const lowerBound: ModelInstance<SensorValues> = server.create('sensorValue')
    const upperBound: ModelInstance<SensorValues> = server.create('sensorValue')
    // Swap bounds so that the values of lowerBound are all <= upperBound
    Object.keys(lowerBound.attrs).forEach((sensorValKey) => {
      const castKey = sensorValKey as keyof SensorValues
      const lowerVal = Math.min(
        lowerBound.attrs[castKey],
        upperBound.attrs[castKey]
      )
      upperBound.update({
        [castKey]: Math.max(
          lowerBound.attrs[castKey],
          upperBound.attrs[castKey]
        ),
      })
      lowerBound.update({
        [castKey]: lowerVal,
      })
    })

    // Create access point
    const ap: ModelInstance<AccessPoint> = server.create('accessPoint')

    // Cerate measurements
    const measurements = server.createList(
      'measurement',
      faker.datatype.number({ min: 0, max: 30 })
    ) as ModelInstance<Measurement>[]

    // Update sensorStation object
    sensorStation.update({
      gardeners: gardenerIds,
      lowerBound: lowerBound.attrs,
      measurements: measurements.map((m) => m.attrs),
      upperBound: upperBound.attrs,
      accessPoint: ap.attrs.apId,
    })
  },
})
