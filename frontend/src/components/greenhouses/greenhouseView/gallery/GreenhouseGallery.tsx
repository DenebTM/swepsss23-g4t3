import React from 'react'

import { SensorStationUuid } from '~/models/sensorStation'

interface GreenhouseGalleryProps {
  uuid: SensorStationUuid
}

/**
 * Gallery page showing photos for a single sensor station
 */
export const GreenhouseGallery: React.FC<GreenhouseGalleryProps> = (props) => {
  return <p>Greenhouse gallery view for greenhouse {props.uuid}</p>
}
