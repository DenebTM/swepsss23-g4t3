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

import {
  DataValue,
  measurementToGraphValues,
  normalisePercentage,
  RAW_VALUES_KEY,
  TIMESTAMP_KEY,
} from './helpers'

interface GreenhouseGraphProps {
  measurements: Measurement[]
  sensorStation: SensorStation | undefined
  ssID: SensorStationUuid
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
        [RAW_VALUES_KEY]: measurementToGraphValues(
          measurement,
          (value: number) => value
        ),
      }))

      // Save data values sorted by timestamp
      dataVals.sort((a, b) =>
        dayjs(a[TIMESTAMP_KEY]).isBefore(dayjs(b[TIMESTAMP_KEY])) ? -1 : 1
      )
      setData(dataVals)
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
            Percentile (%)
          </Label>
        </YAxis>
        <Tooltip<number | string, string>
          labelFormatter={(isoTimestamp: string) =>
            dayjs(isoTimestamp).format('YYYY-MM-DD HH:mm:ss')
          }
          formatter={(value: number | string, name, payload, index) => {
            const key = String(payload.dataKey)
            const trueValue: number = payload.payload[RAW_VALUES_KEY][key]
            return `${roundMetric(trueValue)}${
              GREENHOUSE_METRICS.find((m) => m.valueKey === payload.dataKey)
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
