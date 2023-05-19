import { faker } from '@faker-js/faker'
import { Factory, ModelInstance, Server } from 'miragejs'
import { AccessPoint } from '~/models/accessPoint'
import { Measurement, SensorValues } from '~/models/measurement'
import { SensorStation, StationStatus } from '~/models/sensorStation'
import { AuthUserRole, Username } from '~/models/user'

import { AfterCreate, AppRegistry } from '../mirageTypes'

/**
 * Return function which applies `comparisonFn` to each value in `prev` and `current`
 * and return the resulting `SensorValues` object.
 */
const compareSensorVals =
  (comparisonFn: (...values: number[]) => number) =>
  (prev: SensorValues, current: SensorValues): SensorValues => {
    let k: keyof SensorValues
    const output: SensorValues = { ...current }
    for (k in current) {
      output[k] = comparisonFn(current[k], prev[k])
    }
    return output
  }

/** Randomly jitter sensor values by a percentage of the current value */
const randomJitter = (sensorValues: SensorValues, percentage = 0.2) =>
  Object.keys(sensorValues).reduce((a: SensorValues, k: string) => {
    const val: number = a[k as keyof SensorValues]
    const plusMinus = faker.helpers.arrayElement([-1, +1])
    const jitter = faker.datatype.float({
      min: 0,
      max: percentage,
      precision: 0.01,
    })

    return {
      ...a,
      [k]: val + val * plusMinus * jitter,
    }
  }, sensorValues)

/**
 * Factory to generate a fake {@link SensorStation}.
 * Properties requiring relations (corresponding to the ommitted keys) should be called when generating seed data.
 * See: https://miragejs.com/docs/main-concepts/factories/
 */
export const sensorStationFactory = Factory.extend<
  Omit<
    SensorStation,
    | 'apName'
    | 'gardeners'
    | 'lowerBound'
    | 'currentMeasurement'
    | 'upperBound'
    | 'measurements'
  > &
    AfterCreate<SensorStation>
>({
  ssID(i: number) {
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
      server.create('user', {
        username: userId,
        userRole: AuthUserRole.GARDENER,
      })
    }

    // Create access point
    const ap: ModelInstance<AccessPoint> = server.create('accessPoint')
    ap.update('sensorStations', [sensorStation.attrs.ssID])

    // Create measurements
    const measurements = server.createList(
      'measurement',
      faker.datatype.number({ min: 0, max: 30 })
    ) as ModelInstance<Measurement>[]

    // Generate upper and lower bounds near the generated measurements
    const measurementVals: SensorValues[] = measurements.map(
      (m) => m.attrs.data
    )

    // Create bounds objects, returning null with a 25% probability
    const boundIsNullDenom = 4

    // Generate mocked lower bound
    let lowerBound: ModelInstance<SensorValues> | null = null
    if (faker.datatype.number({ min: 0, max: boundIsNullDenom - 1 }) === 0) {
      lowerBound = server.create('sensorValue') as ModelInstance<SensorValues>
      const minSensorValues = measurementVals.reduce(
        compareSensorVals(Math.min),
        lowerBound.attrs
      )
      // Randomly jitter min values
      lowerBound.update(randomJitter(minSensorValues))
    }

    // Generate mocked upper bound
    let upperBound: ModelInstance<SensorValues> | null = null
    if (faker.datatype.number({ min: 0, max: boundIsNullDenom - 1 }) === 0) {
      upperBound = server.create('sensorValue') as ModelInstance<SensorValues>
      const maxSensorValues = measurementVals.reduce(
        compareSensorVals(Math.max),
        upperBound.attrs
      )
      // Randomly jitter min values
      upperBound.update(randomJitter(maxSensorValues))
    }

    // Update sensorStation object
    sensorStation.update({
      currentMeasurement:
        measurements.length > 0 ? measurements[0].attrs : null,
      gardeners: gardenerIds,
      lowerBound: lowerBound ? lowerBound.attrs : null,
      measurements: measurements.map((m) => m.attrs),
      upperBound: upperBound ? upperBound.attrs : null,
      apName: ap.attrs.name,
    })
  },
})
