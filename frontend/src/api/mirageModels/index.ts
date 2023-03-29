import { Model } from 'miragejs'
import { ModelDefinition } from 'miragejs/-types'
import { User } from '~/models/user'

const UserModel: ModelDefinition<User> = Model.extend({})

export const models = {
  user: UserModel,
}
