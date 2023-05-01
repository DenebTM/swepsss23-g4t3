import React from 'react'

import Stack from '@mui/material/Stack'
import useMediaQuery from '@mui/material/useMediaQuery'

import { GREENHOUSE_METRICS } from '~/common'
import { Measurement } from '~/models/measurement'
import { SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { GreenhouseDonut } from './GreenhouseDonut'

interface GreenhouseDonutsProps {
  measurement: Measurement | null
  uuid: SensorStationUuid
}

/**
 * Metric donuts showing greenhouse temperature, soil moisture, and light intensity
 */
export const GreenhouseDonuts: React.FC<GreenhouseDonutsProps> = (props) => {
  const stackDonuts = useMediaQuery(theme.breakpoints.down('sm'))
  const donutHeight = stackDonuts ? 150 : 200

  return (
    <Stack spacing={1} padding={2} direction={stackDonuts ? 'column' : 'row'}>
      {props.measurement !== null ? (
        <>
          {' '}
          <GreenhouseDonut
            donutHeight={donutHeight}
            metricRange={GREENHOUSE_METRICS[0]}
            value={props.measurement.data.temperature}
          />
          <GreenhouseDonut
            donutHeight={donutHeight}
            metricRange={GREENHOUSE_METRICS[1]}
            value={props.measurement.data.lightIntensity}
          />
          <GreenhouseDonut
            donutHeight={donutHeight}
            metricRange={GREENHOUSE_METRICS[2]}
            value={props.measurement.data.soilMoisture}
          />
        </>
      ) : (
        <div>TODO no measurements case</div>
      )}
    </Stack>
  )
}
