import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import Box from '@mui/system/Box'

import { getSensorStation } from '~/api/endpoints/sensorStations/sensorStations'
import { Message, MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { UploadHeader } from './UploadHeader'
import { UploadPageBody } from './UploadPageBody/UploadPageBody'

interface UploadPageContentsProps {
  ssID: SensorStationUuid
}

/**
 * Page body for photo upload
 * Fetches the current sensor station from the backend and allows file upload
 */
export const UploadPageContents: React.FC<UploadPageContentsProps> = (
  props
) => {
  const addSnackbarMessage = useAddSnackbarMessage()

  const [sensorStation, setSensorStation] = useState<SensorStation>()
  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /** Load sensor station from the API on component mount */
  useEffect(() => {
    const ssPromise = cancelable(getSensorStation(props.ssID))
    ssPromise
      .then((data) => {
        setSensorStation(data)
      })
      .catch((err: Error) =>
        setSnackbarMessage({
          header: 'Could not load sensor station',
          body: err.message,
          type: MessageType.ERROR,
        })
      )

    // Cancel the promise callbacks on component unmount
    return ssPromise.cancel
  }, [setSnackbarMessage])

  /** Create a new snackbar if {@link snackbarMessage} has been updated */
  useEffect(() => {
    if (snackbarMessage !== null) {
      addSnackbarMessage(snackbarMessage)
    }
  }, [snackbarMessage])

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(4, 2),
      }}
    >
      <UploadHeader ssID={props.ssID} />

      {typeof sensorStation !== 'undefined' && (
        <UploadPageBody sensorStation={sensorStation} />
      )}
    </Box>
  )
}
