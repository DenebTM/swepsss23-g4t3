import React from 'react'

import { Measurement } from '~/models/measurement'
import { SensorStationUuid } from '~/models/sensorStation'

interface GreenhouseDonutsProps {
  measurement: Measurement | null
  uuid: SensorStationUuid
}

/**
 * Metric donuts showing greenhouse temperature, soil moisture, and light intensity
 */
export const GreenhouseDonuts: React.FC<GreenhouseDonutsProps> = (props) => {
  return <div>Greenhouse Donuts: {JSON.stringify(props.measurement)}</div>
}
