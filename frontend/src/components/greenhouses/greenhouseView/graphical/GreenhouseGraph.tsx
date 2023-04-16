import React from 'react'

import { Measurement } from '~/models/measurement'
import { SensorStationUuid } from '~/models/sensorStation'

interface GreenhouseGraphProps {
  measurements: Measurement[]
  uuid: SensorStationUuid
}

/**
 * Graph showing recent greenhouse sensor data
 */
export const GreenhouseGraph: React.FC<GreenhouseGraphProps> = (props) => {
  return (
    <div>
      Greenhouse Graph: {JSON.stringify(props.measurements.slice(0, 5))}
    </div>
  )
}
