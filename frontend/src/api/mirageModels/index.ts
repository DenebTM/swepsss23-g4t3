import { belongsTo, hasMany, Model } from 'miragejs'
import { ModelDefinition } from 'miragejs/-types'
import { AccessPoint } from '~/models/accessPoint'
import { LogEntry } from '~/models/log'
import { Measurement, SensorValues } from '~/models/measurement'
import { SensorStation } from '~/models/sensorStation'
import { User } from '~/models/user'

const _UserModel: ModelDefinition<User> = Model.extend({})
const _AccessPointModel: ModelDefinition<AccessPoint> = Model.extend({})
export const _SensorStationModel: ModelDefinition<SensorStation> = Model.extend(
  {
    accessPoint: belongsTo,
    gardeners: hasMany,
    lowerBound: belongsTo,
    upperBound: belongsTo,
    measurements: hasMany,
  }
)
const _SensorValuesModel: ModelDefinition<SensorValues> = Model.extend({})
const _MeasurementModel: ModelDefinition<Measurement> = Model.extend({
  sensorValues: belongsTo,
})
const _LogEntryModel: ModelDefinition<LogEntry> = Model.extend({})

/** Models so that the mocked API knows what types of entities to expect. */
export const models = {
  user: _UserModel,
  accessPoint: _AccessPointModel,
  measurement: _MeasurementModel,
  sensorStation: _SensorStationModel,
  sensorValue: _SensorValuesModel,
  logEntry: _LogEntryModel,
}
