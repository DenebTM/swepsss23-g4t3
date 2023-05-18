import React from 'react'
import { ResponsiveContainer } from 'recharts'

import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/system/Box'

import { GreenhouseMetricRange, roundMetric } from '~/common'
import { theme } from '~/styles/theme'

import { DonutLabel } from './DonutLabel'
import { RadialChart } from './RadialChart'

interface GreenhouseDonutProps {
  donutHeight: number
  icon: React.ReactNode
  metricRange: GreenhouseMetricRange
  maxThreshold: number | undefined
  minThreshold: number | undefined
  value: number
}

/**
 * Donut chart showing a single greenhouse metric
 */
export const GreenhouseDonut: React.FC<GreenhouseDonutProps> = (props) => {
  const breakMd = useMediaQuery(theme.breakpoints.down('md'))

  const outOfRange =
    (typeof props.minThreshold !== 'undefined' &&
      props.value < props.minThreshold) ||
    (typeof props.maxThreshold !== 'undefined' &&
      props.value > props.maxThreshold)

  return (
    <Box minWidth={props.donutHeight} height={props.donutHeight}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialChart
          data={[
            {
              metricRange: props.metricRange,
              minThreshold: props.minThreshold ?? props.metricRange.min,
              maxThreshold: props.maxThreshold ?? props.metricRange.max,
              value: props.value,
            },
          ]}
          height={props.donutHeight}
          width={props.donutHeight}
        />
      </ResponsiveContainer>

      <DonutLabel
        bottom={Math.round(props.donutHeight * 0.25)}
        outOfRange={outOfRange}
      >
        {outOfRange ? <ReportProblemIcon fontSize="small" /> : props.icon}
        <Typography
          color="inherit"
          variant={breakMd ? 'bodySmall' : 'bodyMedium'}
          sx={{ marginLeft: '3px' }}
        >
          {props.metricRange.displayName}
        </Typography>
      </DonutLabel>

      <DonutLabel
        bottom={Math.round(props.donutHeight * 0.7)}
        outOfRange={outOfRange}
      >
        <Typography
          color="inherit"
          variant={breakMd ? 'headlineSmall' : 'headlineMedium'}
        >
          {roundMetric(props.value)}
        </Typography>
        <Typography
          color="inherit"
          variant={breakMd ? 'bodySmall' : 'bodyMedium'}
        >
          {props.metricRange.unit}
        </Typography>
      </DonutLabel>
    </Box>
  )
}
