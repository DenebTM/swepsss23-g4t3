import { faker } from '@faker-js/faker'
import { Factory } from 'miragejs'
import { Measurement, SensorValues } from '~/models/measurement'

/** Return a fake decimal value between min and max inclusive */
const fake_double = (min: number, max: number): number =>
  faker.datatype.number({
    min: min,
    max: max,
    precision: 0.000001,
  })

/**
 * Factory to generate a fake {@link Measurement}
 * Key `data` should be generated when generating seed data to also create the measurement data in the database.
 * See: https://miragejs.com/docs/main-concepts/factories/
 */
export const measurementFactory = Factory.extend<Omit<Measurement, 'data'>>({
  timestamp() {
    return faker.date
      .between('2020-01-01T00:00:00.000Z', '2023-03-15T00:00:00.000Z')
      .toISOString()
  },
})

/** Factory to generate a fake {@link SensorValues} */
export const sensorValuesFactory = Factory.extend<SensorValues>({
  airPressure() {
    return fake_double(700, 1200)
  },
  airQuality() {
    return fake_double(0, 500)
  },
  humidity() {
    return fake_double(0, 100)
  },
  lightIntensity() {
    return fake_double(10, 1000)
  },
  soilMoisture() {
    return fake_double(0, 100)
  },
  temperature() {
    return fake_double(0, 60)
  },
})
