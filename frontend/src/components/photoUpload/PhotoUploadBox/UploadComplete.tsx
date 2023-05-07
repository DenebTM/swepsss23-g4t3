import React, { Dispatch, SetStateAction } from 'react'

import { SensorStation } from '~/models/sensorStation'

import { UploadStatus } from './UploadArea'

interface UploadCompleteProps {
  sensorStation: SensorStation
  setUploadStatus: Dispatch<SetStateAction<UploadStatus>>
}

/**
 * Screen to show once at least one photo has been uploaded for the sensor station
 */
export const UploadComplete: React.FC<UploadCompleteProps> = (props) => {
  return <div>UPLOAD DONE</div>
}
