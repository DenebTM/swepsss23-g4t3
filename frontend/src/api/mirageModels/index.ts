import { Model } from 'miragejs'
import { ModelDefinition } from 'miragejs/-types'
import { User } from '~/models/user'

const UserModel: ModelDefinition<User> = Model.extend({})

/** Models for the mocked API to know what types of entities to expect. */
export const models = {
  user: UserModel,
}
