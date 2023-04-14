import React, { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import dayjs from 'dayjs'
import {
  GREENHOUSE_METRICS,
  GreenhouseMetricRange,
  roundMetric,
} from '~/common'
import { Measurement, SensorValues } from '~/models/measurement'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

/**
 * Normalise a value into a percentage.
 * Will be between 0 and 100 if the value lies between minimum and maximum
 */
const normalisePercentage = (value: number, minimum: number, maximum: number) =>
  (100 * (value - minimum)) / (maximum - minimum)

/** Type synonym for graph key-value pairs */
type GraphValues = Record<keyof SensorValues, number>

/** Key of timestamp parameter in greenhouse values */
const TIMESTAMP_KEY = 'isoTimestamp'

/** Convert a {@link Measurement} to an object of type {@link GraphValues} and cast type. */
const measurementToGraphValues = (
  m: Measurement,
  valueGetter: (value: number, valueKey: keyof SensorValues) => number
): GraphValues =>
  Object.fromEntries(
    GREENHOUSE_METRICS.map((metricRange: GreenhouseMetricRange) => [
      metricRange.valueKey,
      valueGetter(m.data[metricRange.valueKey], metricRange.valueKey),
    ])
  ) as GraphValues

type DataValue = {
  [TIMESTAMP_KEY]: string
  rawValues: GraphValues
} & GraphValues

interface GreenhouseGraphProps {
  measurements: Measurement[]
  sensorStation: SensorStation | undefined
  uuid: SensorStationUuid
}

/**
 * Graph showing recent greenhouse sensor data
 */
export const GreenhouseGraph: React.FC<GreenhouseGraphProps> = (props) => {
  const [data, setData] = useState<DataValue[]>()

  useEffect(() => {
    if (typeof props.sensorStation !== 'undefined') {
      const lower: SensorValues = props.sensorStation.lowerBound
      const upper: SensorValues = props.sensorStation.upperBound

      const dataVals: DataValue[] = props.measurements.map((measurement) => ({
        [TIMESTAMP_KEY]: measurement.timestamp,
        // Save values normalised to a percentage relative to sensor station bounds
        ...measurementToGraphValues(
          measurement,
          (value: number, valueKey: keyof SensorValues) =>
            normalisePercentage(value, lower[valueKey], upper[valueKey])
        ),
        // Save raw values
        rawValues: measurementToGraphValues(
          measurement,
          (value: number) => value
        ),
      }))

      // Save data values sorted by timestamp
      setData(
        dataVals.sort((a, b) =>
          dayjs(a[TIMESTAMP_KEY]).isBefore(dayjs(b[TIMESTAMP_KEY])) ? 1 : -1
        )
      )
    } else {
      setData([])
    }
  }, [props.measurements])

  return (
    <ResponsiveContainer width="100%" aspect={2.5}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={TIMESTAMP_KEY}
          tickFormatter={(isoTimestamp: string) =>
            dayjs(isoTimestamp).format('YYYY-MM-DD')
          }
        />
        <YAxis>
          <Label angle={-90} position="left" fill={theme.outline}>
            Percentile
          </Label>
        </YAxis>
        <Tooltip<number | string, string>
          labelFormatter={(isoTimestamp: string) =>
            dayjs(isoTimestamp).format('YYYY-MM-DD HH:mm:ss')
          }
          formatter={(value: number | string, name, payload, index) => {
            const key = String(payload.dataKey)
            const trueValue: number = payload.payload['rawValues'][key]
            return `${roundMetric(trueValue)}${
              GREENHOUSE_METRICS.find((m) => m.valueKey == payload.dataKey)
                ?.unit
            }`
          }}
        />

        <Legend />

        {GREENHOUSE_METRICS.map((metricRange: GreenhouseMetricRange) => (
          <Line
            key={metricRange.valueKey}
            activeDot
            dataKey={metricRange.valueKey}
            dot={false}
            name={metricRange.displayName}
            stroke={metricRange.colour}
            strokeWidth={2}
            type="monotone"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
