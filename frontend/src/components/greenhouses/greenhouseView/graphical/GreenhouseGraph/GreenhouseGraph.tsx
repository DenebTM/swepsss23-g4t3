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
import { SensorStation } from '~/models/sensorStation'
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
  sensorStation: SensorStation | null
}

/**
 * Graph showing recent greenhouse sensor data
 */
export const GreenhouseGraph: React.FC<GreenhouseGraphProps> = (props) => {
  const [data, setData] = useState<DataValue[]>()

  useEffect(() => {
    if (props.sensorStation) {
      const lower = props.sensorStation.lowerBound
      const upper = props.sensorStation.upperBound

      const dataVals: DataValue[] = props.measurements.map((measurement) => ({
        [TIMESTAMP_KEY]: measurement.timestamp,
        // Save values normalised to a percentage relative to sensor station bounds
        ...measurementToGraphValues(
          measurement,
          (value: number, valueKey: keyof SensorValues) =>
            normalisePercentage(
              value,
              lower ? lower[valueKey] : GREENHOUSE_METRICS[valueKey].min,
              upper ? upper[valueKey] : GREENHOUSE_METRICS[valueKey].max
            )
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
  }, [props.measurements, props.sensorStation])

  return (
    <ResponsiveContainer width="100%">
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
        <YAxis
          unit="%"
          domain={[-25, 125]}
          ticks={[-25, 0, 25, 50, 75, 100, 125]}
          allowDataOverflow
        >
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
            const trueValue: number = payload.payload[RAW_VALUES_KEY][key]
            return `${roundMetric(trueValue)}${GREENHOUSE_METRICS[key].unit}`
          }}
        />

        <Legend align="center" />

        {Object.values(GREENHOUSE_METRICS).map(
          (metricRange: GreenhouseMetricRange) => (
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
          )
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
