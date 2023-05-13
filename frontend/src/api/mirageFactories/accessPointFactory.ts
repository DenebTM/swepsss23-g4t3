import { faker } from '@faker-js/faker'
import { Factory } from 'miragejs'
import { AccessPoint, ApStatus } from '~/models/accessPoint'

/** Factory to generate a fake {@link AccessPoint} */
export const accessPointFactory = Factory.extend<AccessPoint>({
  name(i: number) {
    return `access-point-${i}`
  },
  status() {
    return faker.helpers.arrayElement(Object.values(ApStatus))
  },
  serverAddress() {
    return faker.internet.ipv4()
  },
  lastUpdate() {
    return faker.date
      .between('2023-03-29T00:00:00.000Z', '2023-03-30T00:00:00.000Z')
      .toISOString()
  },
  sensorStations() {
    return []
  },
})
