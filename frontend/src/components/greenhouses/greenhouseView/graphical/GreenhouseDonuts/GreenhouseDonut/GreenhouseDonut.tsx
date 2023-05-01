import React from 'react'
import { ResponsiveContainer } from 'recharts'

import ReportProblemIcon from '@mui/icons-material/ReportProblem'
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
  const sensorStationMin =
    props.sensorStation.lowerBound[props.metricRange.valueKey]
  const sensorStationMax =
    props.sensorStation.upperBound[props.metricRange.valueKey]

  const outOfRange =
    props.value < sensorStationMin || props.value > sensorStationMax

  return (
    <Box width={props.donutHeight * 2} height={props.donutHeight}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialChart
          height={props.donutHeight}
          metricRange={props.metricRange}
          sensorStationMin={sensorStationMin}
          sensorStationMax={sensorStationMax}
          value={props.value}
          width={props.donutHeight * 2}
        />
      </ResponsiveContainer>

      <DonutLabel
        bottom={Math.round(props.donutHeight * 0.6)}
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
      <DonutLabel
        bottom={Math.max(Math.round(props.donutHeight * 0.46), 70)}
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
    </Box>
  )
}
