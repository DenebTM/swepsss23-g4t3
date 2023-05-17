import React from 'react'

import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import { SvgIconTypeMap } from '@mui/material/SvgIcon'
import Grid from '@mui/material/Unstable_Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/system/Box'

import { GreenhouseMetricRange, NON_AIR_METRICS } from '~/common'
import { Measurement } from '~/models/measurement'
import { SensorStation } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { GreenhouseAirMetrics } from './GreenhouseDonut/GreenhouseAirMetrics'
import { GreenhouseDonut } from './GreenhouseDonut/GreenhouseDonut'

const donutIconProps: Partial<SvgIconTypeMap['props']> = {
  fontSize: 'small',
  color: 'inherit',
}

const gridBreakpoints = {
  xs: 12,
  sm: 6,
  md: 3,
}

interface GreenhouseDonutsProps {
  measurement: Measurement | null
  sensorStation: SensorStation | null
}

/**
 * Metric donuts showing greenhouse temperature, soil moisture, and light intensity
 */
export const GreenhouseMetricDonuts: React.FC<GreenhouseDonutsProps> = (
  props
) => {
  const { sensorStation, measurement } = { ...props }
  const breakMd = useMediaQuery(theme.breakpoints.down('md'))
  const breakSm = useMediaQuery(theme.breakpoints.down('sm'))

  /** Donut height in px. qqjf TODO make this responsive  */
  const donutHeight = breakSm ? 250 : breakMd ? 175 : 200

  if (sensorStation === null) {
    return <div>TODO qqjf loading state</div>
  } else {
    const donutProps = (metricRange: GreenhouseMetricRange) => ({
      donutHeight: donutHeight,
      metricRange: metricRange,
      sensorStation: sensorStation,
      maxThreshold: sensorStation.upperBound[metricRange.valueKey],
      minThreshold: sensorStation.lowerBound[metricRange.valueKey],
    })

    return (
      <Box
        sx={{
          width: '100%',
        }}
      >
        {measurement !== null ? (
          <Grid container spacing={1} padding={2}>
            <Grid {...gridBreakpoints}>
              <GreenhouseDonut
                {...donutProps(NON_AIR_METRICS[0])}
                icon={<ThermostatIcon {...donutIconProps} />}
                value={measurement.data.temperature}
              />
            </Grid>
            <Grid {...gridBreakpoints}>
              <GreenhouseDonut
                {...donutProps(NON_AIR_METRICS[1])}
                icon={<WaterDropOutlinedIcon {...donutIconProps} />}
                value={measurement.data.soilMoisture}
              />
            </Grid>
            <Grid {...gridBreakpoints}>
              <GreenhouseDonut
                {...donutProps(NON_AIR_METRICS[2])}
                icon={<LightModeOutlinedIcon {...donutIconProps} />}
                value={measurement.data.lightIntensity}
              />
            </Grid>
            <Grid {...gridBreakpoints}>
              <GreenhouseAirMetrics
                donutHeight={donutHeight}
                measurement={props.measurement}
                sensorStation={props.sensorStation}
              />
            </Grid>
          </Grid>
        ) : (
          <div>TODO qqjf no measurements case</div>
        )}
      </Box>
    )
  }
}
