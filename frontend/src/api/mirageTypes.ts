import { Registry } from 'miragejs'
import Schema from 'miragejs/orm/schema'

import { factories } from './mirageFactories'
import { models } from './mirageModels'

export type AppRegistry = Registry<typeof models, typeof factories>

/** Type for the mirage database schema */
export type AppSchema = Schema<AppRegistry>
