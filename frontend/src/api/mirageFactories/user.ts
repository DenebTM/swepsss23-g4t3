import { faker } from '@faker-js/faker'
import { Factory } from 'miragejs'
import { User } from '~/models/user'

/** Factory to generate fake User objects */
export const userFactory = Factory.extend<User>({
  username(i: number) {
    return `user${i + 1}`
  },
  firstName() {
    return faker.name.firstName()
  },
  lastName() {
    return faker.name.lastName()
  },
})
