import React, { useEffect, useRef, useState } from 'react'

import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import { SvgIconTypeMap } from '@mui/material/SvgIcon'
import Grid from '@mui/material/Unstable_Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/system/Box'

import { Spinner } from '@component-lib/Spinner'
import { GreenhouseMetricRange, NON_AIR_METRICS } from '~/common'
import { useWindowSize } from '~/hooks/windowSize'
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

  const donutContainerRef = useRef<HTMLDivElement>()
  const windowSize = useWindowSize()
  const [donutHeight, setDonutHeight] = useState<number>(175) // Donut height and width in px
  const breakMd = useMediaQuery(theme.breakpoints.down('md'))
  const breakSm = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    if (donutContainerRef.current) {
      const containerWidth = donutContainerRef.current.clientWidth
      const donutsPerRow = breakSm ? 1 : breakMd ? 2 : 4

      console.log(
        containerWidth,
        Math.floor(containerWidth / donutsPerRow),
        donutsPerRow
      )
      setDonutHeight(Math.floor(containerWidth / donutsPerRow))
    }
  }, [donutContainerRef, windowSize])

  if (sensorStation === null) {
    return <Spinner />
  } else {
    const donutProps = (metricRange: GreenhouseMetricRange) => ({
      donutHeight: donutHeight,
      metricRange: metricRange,
      sensorStation: sensorStation,
      maxThreshold: sensorStation.upperBound
        ? sensorStation.upperBound[metricRange.valueKey]
        : undefined,
      minThreshold: sensorStation.lowerBound
        ? sensorStation.lowerBound[metricRange.valueKey]
        : undefined,
    })

    return (
      <Box
        component="div"
        sx={{
          width: '100%',
        }}
        ref={donutContainerRef}
      >
        {measurement !== null ? (
          <Grid container spacing={1}>
            <Grid {...gridBreakpoints}>
              <GreenhouseDonut
                {...donutProps(NON_AIR_METRICS['temperature'])}
                icon={<ThermostatIcon {...donutIconProps} />}
                value={measurement.data.temperature}
              />
            </Grid>
            <Grid {...gridBreakpoints}>
              <GreenhouseDonut
                {...donutProps(NON_AIR_METRICS['soilMoisture'])}
                icon={<WaterDropOutlinedIcon {...donutIconProps} />}
                value={measurement.data.soilMoisture}
              />
            </Grid>
            <Grid {...gridBreakpoints}>
              <GreenhouseDonut
                {...donutProps(NON_AIR_METRICS['lightIntensity'])}
                icon={<LightModeOutlinedIcon {...donutIconProps} />}
                value={measurement.data.lightIntensity}
              />
            </Grid>
            <Grid
              {...gridBreakpoints}
              sx={{ alignSelf: 'center', textAlign: 'center' }}
            >
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
