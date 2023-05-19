import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import GalleryIcon from '@component-lib/icons/GalleryIcon'
import Uploady from '@rpldy/uploady'
import { uploadPhotosUrl } from '~/api/endpoints/sensorStations/photos'
import { PAGE_URL, SensorStationView, UPLOADED_PHOTO_KEY } from '~/common'
import { SensorStation } from '~/models/sensorStation'

import { ClickableUploadArea } from './ClickableUploadArea'
import { getUploadArea, UploadStatus } from './getUploadArea'
import { UploadMorePhotosButton } from './UploadMorePhotosButton'

interface UploadPageBodyProps {
  sensorStation: SensorStation
}

/**
 * Page body for uploading photos for a single sensor station
 */
export const UploadPageBody: React.FC<UploadPageBodyProps> = (props) => {
  const navigate = useNavigate()
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
    UploadStatus.READY
  )
  /** STore whether at least one photo has already been uploaded by the user */
  const [uploadCompleted, setUploadCompleted] = useState(false)

  useEffect(() => {
    if (uploadStatus === UploadStatus.FINISHED) {
      setUploadCompleted(true)
    }
  }, [uploadStatus])

  /** Pass the state setting function into the Uploady child to keep track of uploads in the parent */
  const UploadArea = uploadCompleted
    ? getUploadArea(UploadMorePhotosButton, uploadStatus, setUploadStatus)
    : getUploadArea(ClickableUploadArea, uploadStatus, setUploadStatus)

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {uploadCompleted && (
        <Stack spacing={1} textAlign="center" marginTop={2} marginBottom={2}>
          <Typography
            color="onSurfaceVariant"
            gutterBottom
            variant="titleLarge"
          >
            Upload complete!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            endIcon={<GalleryIcon />}
            fullWidth
            onClick={() =>
              navigate(
                PAGE_URL.greenhouseView.href(
                  props.sensorStation.ssID,
                  SensorStationView.GALLERY
                )
              )
            }
          >
            Navigate to Gallery
          </Button>
        </Stack>
      )}

      <Uploady
        multiple={false}
        accept="image/*"
        destination={{
          url: uploadPhotosUrl(props.sensorStation.ssID),
        }}
        method="POST"
        sendWithFormData
        inputFieldName={UPLOADED_PHOTO_KEY}
      >
        <UploadArea />
      </Uploady>
    </Box>
  )
}
