import React, { useEffect, useState } from 'react'

import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import Stack from '@mui/material/Stack'
import { SvgIconTypeMap } from '@mui/material/SvgIcon'
import useMediaQuery from '@mui/material/useMediaQuery'

import { GREENHOUSE_METRICS, GreenhouseMetricRange } from '~/common'
import { useSensorStations } from '~/hooks/appContext'
import { Measurement } from '~/models/measurement'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { GreenhouseDonut } from './GreenhouseDonut/GreenhouseDonut'

const donutIconProps: Partial<SvgIconTypeMap['props']> = {
  fontSize: 'small',
  color: 'inherit',
}

interface GreenhouseDonutsProps {
  measurement: Measurement | null
  uuid: SensorStationUuid
}

/**
 * Metric donuts showing greenhouse temperature, soil moisture, and light intensity
 */
export const GreenhouseMetricDonuts: React.FC<GreenhouseDonutsProps> = (
  props
) => {
  const sensorStations = useSensorStations()
  const breakMd = useMediaQuery(theme.breakpoints.down('md'))
  const [sensorStation, setSensorStation] = useState<SensorStation | null>()

  /** Set the sensor station object in state when sensorStations are updated */
  useEffect(() => {
    const foundSs = sensorStations
      ? sensorStations.find((s) => s.uuid === props.uuid)
      : null
    setSensorStation(foundSs ?? null)
  }, [sensorStations])

  /** Donut height in px. The width will be approximately twice this value. */
  const donutHeight = breakMd ? 250 : 200

  if (sensorStations === null || typeof sensorStation === 'undefined') {
    return <div>TODO qqjf loading state</div>
  } else if (sensorStation === null) {
    return <div>TODO qqjf loading state</div>
  } else {
    const donutProps = (metricRange: GreenhouseMetricRange) => ({
      donutHeight: donutHeight,
      metricRange: metricRange,
      sensorStation: sensorStation,
      sensorStationMax: sensorStation.upperBound[metricRange.valueKey],
      sensorStationMin: sensorStation.lowerBound[metricRange.valueKey],
    })
    return (
      <Stack
        spacing={1}
        padding={2}
        direction={breakMd ? 'column' : 'row'}
        alignItems="center"
      >
        {props.measurement !== null ? (
          <>
            <GreenhouseDonut
              {...donutProps(GREENHOUSE_METRICS[0])}
              icon={<ThermostatIcon {...donutIconProps} />}
              value={props.measurement.data.temperature}
            />
            <GreenhouseDonut
              {...donutProps(GREENHOUSE_METRICS[1])}
              icon={<WaterDropOutlinedIcon {...donutIconProps} />}
              value={props.measurement.data.soilMoisture}
            />
            <GreenhouseDonut
              {...donutProps(GREENHOUSE_METRICS[2])}
              icon={<LightModeOutlinedIcon {...donutIconProps} />}
              value={props.measurement.data.lightIntensity}
            />
          </>
        ) : (
          <div>TODO qqjf no measurements case</div>
        )}
      </Stack>
    )
  }
}
