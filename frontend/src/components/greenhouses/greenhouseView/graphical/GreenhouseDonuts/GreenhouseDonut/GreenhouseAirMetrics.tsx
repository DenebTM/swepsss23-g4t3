import React from 'react'
import { ResponsiveContainer } from 'recharts'

import AirIcon from '@mui/icons-material/Air'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/system/Box'

import { AIR_METRICS, GreenhouseMetricRange } from '~/common'
import { Measurement } from '~/models/measurement'
import { SensorStation } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { DonutLabel } from './DonutLabel'
import { RadialChart } from './RadialChart'

interface GreenhouseAirMetricsProps {
  donutHeight: number
  measurement: Measurement | null
  sensorStation: SensorStation | null
}

/**
 * Radial chart showing current air pressure, quality, and humidity
 */
export const GreenhouseAirMetrics: React.FC<GreenhouseAirMetricsProps> = (
  props
) => {
  const breakMd = useMediaQuery(theme.breakpoints.down('md'))
  const { sensorStation, measurement } = { ...props }

  const outOfRange =
    sensorStation !== null &&
    measurement !== null &&
    AIR_METRICS.some(
      (mr: GreenhouseMetricRange) =>
        measurement.data[mr.valueKey] < sensorStation.lowerBound[mr.valueKey] ||
        measurement.data[mr.valueKey] > sensorStation.upperBound[mr.valueKey]
    )

  if (sensorStation === null) {
    return <CircularProgress color="primary" />
  } else if (measurement === null) {
    return <div>qqjf TODO no measurement state</div>
  } else {
    return (
      <Box minWidth={props.donutHeight} height={props.donutHeight}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialChart
            data={AIR_METRICS.map((metricRange) => ({
              metricRange: metricRange,
              maxThreshold: sensorStation.upperBound[metricRange.valueKey],
              minThreshold: sensorStation.lowerBound[metricRange.valueKey],
              value: measurement.data[metricRange.valueKey],
            }))}
            innerRadius="65%"
            height={props.donutHeight}
            width={props.donutHeight}
          />
        </ResponsiveContainer>

        <DonutLabel
          outOfRange={outOfRange}
          bottom={Math.round(props.donutHeight * 0.25)}
        >
          {outOfRange ? (
            <ReportProblemIcon fontSize="small" />
          ) : (
            <AirIcon fontSize="small" />
          )}
          <Typography
            color="inherit"
            variant={breakMd ? 'bodySmall' : 'bodyMedium'}
            sx={{ marginLeft: '3px' }}
          >
            Air Metrics
          </Typography>
        </DonutLabel>
      </Box>
    )
  }
}
