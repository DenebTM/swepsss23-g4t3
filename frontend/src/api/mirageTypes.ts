import { ModelInstance, Registry, Server } from 'miragejs'
import Schema from 'miragejs/orm/schema'

import { factories } from './mirageFactories'
import { models } from './mirageModels'

/** Type containing the models and factories passed to the mirage datavase schema. */
export type AppRegistry = Registry<typeof models, typeof factories>

/** Type for the mirage database schema */
export type AppSchema = Schema<AppRegistry>

/** Function to register a single endpoint given the current state of the {@link Server}. */
export type EndpointReg = (server: Server) => void

/** Interface for an object containing functions to register endpoints indexed by path. */
export interface Endpoints {
  [key: string]: EndpointReg
}

/**
 * interface for the `afterCallback` method of a mirage factory to create an entity of type `E`.
 */
export interface AfterCreate<E extends object> {
  afterCreate: (
    sensorStation: ModelInstance<E>,
    server: Server<AppRegistry>
  ) => void
}
