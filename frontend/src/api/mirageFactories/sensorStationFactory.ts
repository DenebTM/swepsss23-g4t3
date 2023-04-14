import { faker } from '@faker-js/faker'
import { Factory, ModelInstance, Server } from 'miragejs'
import { AccessPoint } from '~/models/accessPoint'
import { Measurement, SensorValues } from '~/models/measurement'
import { SensorStation, StationStatus } from '~/models/sensorStation'
import { Username, UserRole } from '~/models/user'

import { AfterCreate, AppRegistry } from '../mirageTypes'

/**
 * Return a new SensorValue with the containing the result of applying `comparisonFn`
 * to `prev` and `current`. Typecasts result to allow using in a reduce function.
 */
const compareSensorVals =
  (comparisonFn: (...values: number[]) => number) =>
  (prev: SensorValues, current: SensorValues): SensorValues =>
    Object.fromEntries(
      Object.keys(current).map((k) => [
        k,
        comparisonFn(
          current[k as keyof SensorValues],
          prev[k as keyof SensorValues]
        ),
      ])
    ) as unknown as SensorValues

/** Randomly jitter sensor values by a percentage of the current value */
const randomJitter = (sensorValues: SensorValues) =>
  Object.keys(sensorValues).reduce(
    (a: SensorValues, k: string) => ({
      ...a,
      [k]:
        faker.datatype.float({ min: 0.9, max: 1.1, precision: 0.001 }) *
        a[k as keyof SensorValues],
    }),
    sensorValues
  )

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
      server.create('user', { username: userId, role: UserRole.GARDENER })
    }

    // Create access point
    const ap: ModelInstance<AccessPoint> = server.create('accessPoint')

    // Create measurements
    const measurements = server.createList(
      'measurement',
      faker.datatype.number({ min: 0, max: 30 })
    ) as ModelInstance<Measurement>[]

    // Create bound objects
    const lowerBound: ModelInstance<SensorValues> = server.create('sensorValue')
    const upperBound: ModelInstance<SensorValues> = server.create('sensorValue')

    // Generate upper and lower bounds near the generated measurements
    const measurementVals: SensorValues[] = measurements.map(
      (m) => m.attrs.data
    )
    const minSensorValues = measurementVals.reduce(
      compareSensorVals(Math.min),
      lowerBound.attrs
    )
    const maxSensorValues = measurementVals.reduce(
      compareSensorVals(Math.max),
      upperBound.attrs
    )

    // Randomly jitter max and min values
    lowerBound.update(randomJitter(minSensorValues))
    upperBound.update(randomJitter(maxSensorValues))

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
