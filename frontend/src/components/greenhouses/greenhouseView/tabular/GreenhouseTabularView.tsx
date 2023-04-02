import React from 'react'

import { SensorStationUuid } from '~/models/sensorStation'

interface GreenhouseTabularViewProps {
  uuid: SensorStationUuid
}

/**
 * Tabular view of data for a single sensor station
 */
export const GreenhouseTabularView: React.FC<GreenhouseTabularViewProps> = (
  props
) => {
  return <p>Greenhouse tabular view for greenhouse {props.uuid}</p>
}
