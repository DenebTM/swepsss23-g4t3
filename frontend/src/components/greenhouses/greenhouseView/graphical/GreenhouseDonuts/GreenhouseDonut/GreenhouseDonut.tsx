import React from 'react'
import { ResponsiveContainer } from 'recharts'

import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/system/Box'

import { GreenhouseMetricRange, roundMetric } from '~/common'
import { SensorStation } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { DonutLabel } from './DonutLabel'
import { RadialChart } from './RadialChart'

interface GreenhouseDonutProps {
  donutHeight: number
  icon: React.ReactNode
  metricRange: GreenhouseMetricRange
  sensorStation: SensorStation
  value: number
}

/**
 * Donut chart showing a single greenhouse metric
 */
export const GreenhouseDonut: React.FC<GreenhouseDonutProps> = (props) => {
  const breakMd = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box width={props.donutHeight * 2} height={props.donutHeight}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialChart
          height={props.donutHeight}
          metricRange={props.metricRange}
          value={props.value}
          width={props.donutHeight * 2}
        />
      </ResponsiveContainer>

      <DonutLabel bottom={Math.round(props.donutHeight * 0.6)}>
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
      </DonutLabel>
      <DonutLabel bottom={Math.max(Math.round(props.donutHeight * 0.46), 70)}>
        {props.icon}
        <Typography
          color="outline"
          variant={breakMd ? 'bodySmall' : 'bodyMedium'}
          sx={{ marginLeft: '3px' }}
        >
          {props.metricRange.displayName}
        </Typography>
      </DonutLabel>
    </Box>
  )
}
