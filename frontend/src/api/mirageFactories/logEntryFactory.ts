import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { Factory } from 'miragejs'
import { EntityType, LogEntry, LogLevel } from '~/models/log'

/** Factory to generate a mocked {@link LogEntry} */
export const logEntryFactory = Factory.extend<LogEntry>({
  id(i: number) {
    return i
  },
  level() {
    return faker.helpers.arrayElement(Object.values(LogLevel))
  },
  message() {
    return faker.lorem.sentence(faker.datatype.number({ min: 1, max: 40 }))
  },
  origin(i: number) {
    // Return null with a 25% probability
    return faker.datatype.number({ min: 0, max: 3 }) === 0
      ? null
      : {
          id: i,
          type: faker.helpers.arrayElement(Object.values(EntityType)),
        }
  },
  timestamp() {
    return faker.date
      .between(
        dayjs().subtract(1, 'month').toISOString(),
        dayjs().toISOString()
      )
      .toISOString()
  },
})
