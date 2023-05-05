import React, { useState } from 'react'

import Box from '@mui/system/Box'

import Uploady from '@rpldy/uploady'
import { API_DEV_URL, UPLOADED_PHOTO_KEY } from '~/common'
import { SensorStation } from '~/models/sensorStation'

import { getUploadArea, UploadStatus } from './UploadArea'
import { UploadComplete } from './UploadComplete'

interface PhotoUploadBoxProps {
  sensorStation: SensorStation
}

/**
 * Clickable uplod component to upload photos for a single sensor station
 */
export const PhotoUploadBox: React.FC<PhotoUploadBoxProps> = (props) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
    UploadStatus.READY
  )

  /** Pass the state setting function into the Uploady child to keep track of uploads in the parent */
  const UploadArea = getUploadArea(uploadStatus, setUploadStatus)

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      {uploadStatus !== UploadStatus.FINISHED ? (
        <Uploady
          multiple={false}
          accept="image/*"
          destination={{
            url: `${API_DEV_URL}/api/sensor-stations/${props.sensorStation.uuid}/photos`, // TODO qqjf remove /api
          }}
          method="POST"
          sendWithFormData
          inputFieldName={UPLOADED_PHOTO_KEY}
        >
          <UploadArea />
        </Uploady>
      ) : (
        <UploadComplete
          sensorStation={props.sensorStation}
          setUploadStatus={setUploadStatus}
        />
      )}
    </Box>
  )
}
