import React from 'react'

import { SensorStationUuid } from '~/models/sensorStation'

interface GreenhouseGraphicalViewProps {
  uuid: SensorStationUuid
}

/**
 * Page showing a graphical display of information for a single sensor statsion
 */
export const GreenhouseGraphicalView: React.FC<GreenhouseGraphicalViewProps> = (
  props
) => {
  return <p>Greenhouse graphical view for greenhouse {props.uuid}</p>
}
