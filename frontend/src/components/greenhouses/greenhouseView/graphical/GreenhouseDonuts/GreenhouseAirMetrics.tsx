import React from 'react'

import { Measurement } from '~/models/measurement'
import { SensorStationUuid } from '~/models/sensorStation'

interface GreenhouseAirMetricsProps {
  measurement: Measurement | null
  ssID: SensorStationUuid
}

/**
 * Graph showing recent air pressure, quality, and humidity
 */
export const GreenhouseAirMetrics: React.FC<GreenhouseAirMetricsProps> = (
  props
) => {
  return <div>Greenhouse Air Metrics: {JSON.stringify(props.measurement)}</div>
}
