import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import { Spinner } from '@component-lib/Spinner'
import { getSensorStationPhotos } from '~/api/endpoints/sensorStations/photos'
import { Message, MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { Photo } from '~/models/photo'
import { SensorStationUuid } from '~/models/sensorStation'

import { GalleryImageList } from './GalleryImageList'

interface GreenhouseGalleryProps {
  ssID: SensorStationUuid
}

/**
 * Gallery page showing photos for a single sensor station
 */
export const GreenhouseGallery: React.FC<GreenhouseGalleryProps> = (props) => {
  const addSnackbarMessage = useAddSnackbarMessage()
  const [photos, setPhotos] = useState<Photo[]>()
  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /** Load images from the API on component mount */
  useEffect(() => {
    const photoPromise = cancelable(getSensorStationPhotos(props.ssID))
    photoPromise
      .then((data) => {
        setPhotos(data)
      })
      .catch((err: Error) =>
        setSnackbarMessage({
          header: 'Could not load photos',
          body: err.message,
          type: MessageType.ERROR,
        })
      )

    // Cancel the promise callbacks on component unmount
    return photoPromise.cancel
  }, [])

  /** Create a new snackbar if {@link snackbarMessage} has been updated */
  useEffect(() => {
    if (snackbarMessage !== null) {
      addSnackbarMessage(snackbarMessage)
    }
  }, [snackbarMessage])

  return (
    <>
      {photos ? (
        <GalleryImageList
          photos={photos}
          setPhotos={setPhotos}
          ssID={props.ssID}
        />
      ) : (
        <Spinner center />
      )}
    </>
  )
}
