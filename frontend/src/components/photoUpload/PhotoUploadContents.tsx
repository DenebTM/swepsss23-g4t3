import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import { getSensorStation } from '~/api/endpoints/sensorStations/sensorStations'
import { Message, MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { SensorStation } from '~/models/sensorStation'
import { SensorStationUuid } from '~/models/sensorStation'

interface PhotoUploadContentsProps {
  uuid: SensorStationUuid
}

/**
 * Page body for photo upload
 * Fetches the current sensor station from the backend and allows file upload
 */
export const PhotoUploadContents: React.FC<PhotoUploadContentsProps> = (
  props
) => {
  const addSnackbarMessage = useAddSnackbarMessage()

  const [sensorStation, setSensorStation] = useState<SensorStation>()
  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /** Load acccess points from the API on component mount */
  useEffect(() => {
    const ssPromise = cancelable(getSensorStation(props.uuid))
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

  return <div>{JSON.stringify(sensorStation)}</div>
}
