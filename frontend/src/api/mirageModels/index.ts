import { Model } from 'miragejs'
import { ModelDefinition } from 'miragejs/-types'
import { AccessPoint } from '~/models/accessPoint'
import { User } from '~/models/user'

const _UserModel: ModelDefinition<User> = Model.extend({})
const _AccessPointModel: ModelDefinition<AccessPoint> = Model.extend({})

/** Models so that the mocked API knows what types of entities to expect. */
export const models = {
  user: _UserModel,
  accessPoint: _AccessPointModel,
}
