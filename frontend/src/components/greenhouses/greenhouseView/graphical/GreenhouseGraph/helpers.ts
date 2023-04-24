import { GREENHOUSE_METRICS, GreenhouseMetricRange } from '~/common'
import { Measurement, SensorValues } from '~/models/measurement'

/**
 * Normalise a value into a percentage.
 * Will be between 0 and 100 if the value lies between minimum and maximum
 */
export const normalisePercentage = (
  value: number,
  minimum: number,
  maximum: number
) => (100 * (value - minimum)) / (maximum - minimum)

/** Type synonym for graph key-value pairs */
export type GraphValues = Record<keyof SensorValues, number>

/** Key of timestamp parameter in {@link GraphValues} */
export const TIMESTAMP_KEY = 'isoTimestamp'

/** Key of raw data values in {@link GraphValues} */
export const RAW_VALUES_KEY = 'rawValues'

/** Convert a {@link Measurement} to an object of type {@link GraphValues} and cast type. */
export const measurementToGraphValues = (
  m: Measurement,
  valueGetter: (value: number, valueKey: keyof SensorValues) => number
): GraphValues =>
  Object.fromEntries(
    GREENHOUSE_METRICS.map((metricRange: GreenhouseMetricRange) => [
      metricRange.valueKey,
      valueGetter(m.data[metricRange.valueKey], metricRange.valueKey),
    ])
  ) as GraphValues

/** Type of values passed to the greenhouse graph component */
export type DataValue = {
  [TIMESTAMP_KEY]: string
  [RAW_VALUES_KEY]: GraphValues
} & GraphValues
