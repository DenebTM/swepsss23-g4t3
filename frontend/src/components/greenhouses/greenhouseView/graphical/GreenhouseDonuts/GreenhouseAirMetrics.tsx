import React from 'react'
import { ResponsiveContainer } from 'recharts'

import AirIcon from '@mui/icons-material/Air'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/system/Box'

import { GREENHOUSE_METRICS } from '~/common'
import { Measurement } from '~/models/measurement'
import { SensorStation } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { DonutLabel } from './GreenhouseDonut/DonutLabel'
import { RadialChart } from './GreenhouseDonut/RadialChart'

interface GreenhouseAirMetricsProps {
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
  const donutHeight = breakMd ? 150 : 200
  const { sensorStation, measurement } = { ...props }

  const outOfRange = false // qqjf TODO check for values out of bounds

  if (sensorStation === null) {
    return <div>qqjf TODO loading state</div>
  } else if (measurement === null) {
    return <div>qqjf TODO no measurement state</div>
  } else {
    return (
      <Box minWidth={donutHeight} height={donutHeight}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialChart
            data={GREENHOUSE_METRICS.slice(3, 6).map((metricRange) => ({
              metricRange: metricRange,
              maxThreshold: sensorStation.upperBound[metricRange.valueKey],
              minThreshold: sensorStation.lowerBound[metricRange.valueKey],
              value: measurement.data[metricRange.valueKey],
            }))}
            innerRadius="65%"
            height={donutHeight}
            width={donutHeight}
          />
        </ResponsiveContainer>

        <DonutLabel
          bottom={Math.max(Math.round(donutHeight * 0.26), 70)}
          outOfRange={outOfRange}
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
