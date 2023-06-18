import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import { useTheme } from '@mui/material/styles'
import Box from '@mui/system/Box'

import { Spinner } from '@component-lib/Spinner'
import { getSensorStation } from '~/api/endpoints/sensorStations/sensorStations'
import { useAddErrorSnackbar } from '~/hooks/snackbar'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'

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
  const theme = useTheme()

  const addErrorSnackbar = useAddErrorSnackbar()

  const [sensorStation, setSensorStation] = useState<SensorStation>()
  const [snackbarError, setSnackbarError] = useState<Error | null>(null)

  /** Load sensor station from the API on component mount */
  useEffect(() => {
    const ssPromise = cancelable(getSensorStation(props.ssID))
    ssPromise
      .then((data) => {
        setSensorStation(data)
      })
      .catch((err: Error) => setSnackbarError(err))

    // Cancel the promise callbacks on component unmount
    return ssPromise.cancel
  }, [setSnackbarError])

  /** Create a new snackbar if {@link snackbarError} has been updated */
  useEffect(() => {
    if (snackbarError !== null) {
      addErrorSnackbar(snackbarError, 'Could not load sensor station')
    }
  }, [snackbarError])

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

      {typeof sensorStation !== 'undefined' ? (
        <UploadPageBody sensorStation={sensorStation} />
      ) : (
        <Spinner center />
      )}
    </Box>
  )
}
