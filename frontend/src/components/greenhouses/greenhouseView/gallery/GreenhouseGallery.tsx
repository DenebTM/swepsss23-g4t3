import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import { getSensorStationPhotos } from '~/api/endpoints/sensorStations/sensorStations'
import { Message, MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { Image } from '~/models/image'
import { SensorStationUuid } from '~/models/sensorStation'

import { GalleryImageList } from './GalleryImageList'

interface GreenhouseGalleryProps {
  uuid: SensorStationUuid
}

/**
 * Gallery page showing photos for a single sensor station
 */
export const GreenhouseGallery: React.FC<GreenhouseGalleryProps> = (props) => {
  const addSnackbarMessage = useAddSnackbarMessage()
  const [images, setImages] = useState<Image[]>()
  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /** Load images from the API on component mount */
  useEffect(() => {
    const photoPromise = cancelable(getSensorStationPhotos(props.uuid))
    photoPromise
      .then((data) => {
        setImages(data)
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

  return <>{images && <GalleryImageList images={images} uuid={props.uuid} />}</>
}
