import { faker } from '@faker-js/faker'
import { Factory } from 'miragejs'
import { User, UserRole } from '~/models/user'

/** Factory to generate a fake User object */
export const userFactory = Factory.extend<User>({
  username(i: number) {
    return `user${i + 1}`
  },
  created() {
    return faker.date
      .between('2020-01-01T00:00:00.000Z', '2023-03-15T00:00:00.000Z')
      .toISOString()
  },
  firstName() {
    return faker.name.firstName()
  },
  lastName() {
    return faker.name.lastName()
  },
  role() {
    return faker.helpers.arrayElement(Object.values(UserRole))
  },
})
