import React from 'react'
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/system/Box'

import { emDash, GreenhouseMetricRange, roundMetric } from '~/common'
import { SensorStation } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { normalisePercentage } from '../GreenhouseGraph/helpers'

/** Use "Range" as the data key so that this is displayed as the row title in the recharts legend */
const DATA_KEY = 'Range'

interface GreenhouseDonutProps {
  donutHeight: number
  icon: React.ReactNode
  metricRange: GreenhouseMetricRange
  sensorStation: SensorStation
  value: number
}
/**
 * Donuts chart showing a single greenhouse metric
 */
export const GreenhouseDonut: React.FC<GreenhouseDonutProps> = (props) => {
  const breakMd = useMediaQuery(theme.breakpoints.down('md'))

  const caculatePercentage = (): number => {
    const normalisedVal = normalisePercentage(
      props.value,
      props.metricRange.min,
      props.metricRange.max
    )

    // Round to 2 deciomal places
    const roundedVal = Math.round((normalisedVal + Number.EPSILON) * 100) / 100

    // Restrict value to range [0,100] as greenhouse values might be out of bounds
    return Math.max(Math.min(roundedVal, 100), 0)
  }

  return (
    <Box width={props.donutHeight * 2} height={props.donutHeight}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          width={props.donutHeight * 2}
          height={props.donutHeight}
          innerRadius="88%"
          outerRadius="100%"
          data={[
            {
              name: props.metricRange.displayName,
              [DATA_KEY]: caculatePercentage(),
              fill: props.metricRange.colour,
            },
          ]}
          startAngle={180 + 25}
          endAngle={0 - 25}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={props.metricRange.valueKey}
            tick={false}
          />
          <RadialBar
            background
            dataKey={DATA_KEY}
            angleAxisId={props.metricRange.valueKey}
          />
          <Tooltip
            wrapperStyle={{ zIndex: theme.zIndex.tooltip }}
            labelFormatter={(index: number) =>
              `${props.metricRange.displayName} : ${roundMetric(props.value)}${
                props.metricRange.unit
              }`
            }
            formatter={(value: number | string, name, payload, index) => {
              return `${props.metricRange.min} ${emDash} ${props.metricRange.max}${props.metricRange.unit}`
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <Box
        sx={{
          position: 'relative',
          bottom: Math.round(props.donutHeight * 0.6),
          width: '100%',
          margin: '0 auto',
          justifyContent: 'center',
          display: 'flex',
          zIndex: 0,
        }}
      >
        <Typography
          color="outline"
          variant={breakMd ? 'headlineSmall' : 'headlineMedium'}
        >
          {roundMetric(props.value)}
        </Typography>
        <Typography
          color="outline"
          variant={breakMd ? 'bodySmall' : 'bodyMedium'}
        >
          {props.metricRange.unit}
        </Typography>
      </Box>
      <Box
        sx={{
          position: 'relative',
          bottom: Math.max(Math.round(props.donutHeight * 0.4), 60),
          width: '100%',
          margin: '0 auto',
          justifyContent: 'center',
          display: 'flex',
          zIndex: 0,
        }}
      >
        {props.icon}
        <Typography
          color="outline"
          variant={breakMd ? 'bodySmall' : 'bodyMedium'}
          sx={{ marginLeft: '3px' }}
        >
          {props.metricRange.displayName}
        </Typography>
      </Box>
    </Box>
  )
}
