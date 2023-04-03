import { faker } from '@faker-js/faker'
import { Factory } from 'miragejs'
import { AccessPoint } from '~/models/accessPoint'

/** Factory to generate a fake {@link AccessPoint} */
export const accessPointFactory = Factory.extend<AccessPoint>({
  id(i: number) {
    return i
  },
  name(i: number) {
    return `Access Point ${i + 1}`
  },
  active() {
    // Return that an access point is offline with a 1/6 probability
    return faker.datatype.number({ min: 0, max: 5 }) === 0
  },
  serverAddress() {
    return '192.0.0.0'
  },
  lastUpdate() {
    return faker.date
      .between('2023-03-29T00:00:00.000Z', '2023-03-30T00:00:00.000Z')
      .toISOString()
  },
})
