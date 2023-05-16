import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import { Spinner } from '@component-lib/Spinner'
import { getSensorStationPhotos } from '~/api/endpoints/sensorStations/sensorStations'
import { useAddErrorSnackbar } from '~/hooks/snackbar'
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
  const addErrorSnackbar = useAddErrorSnackbar()

  const [photos, setPhotos] = useState<Photo[]>()
  const [snackbarError, setSnackbarError] = useState<Error | null>(null)

  /** Load images from the API on component mount */
  useEffect(() => {
    const photoPromise = cancelable(getSensorStationPhotos(props.ssID))
    photoPromise
      .then((data) => {
        setPhotos(data)
      })
      .catch((err: Error) => setSnackbarError(err))

    // Cancel the promise callbacks on component unmount
    return photoPromise.cancel
  }, [])

  /** Create a new snackbar if {@link snackbarError} has been updated */
  useEffect(() => {
    if (snackbarError !== null) {
      addErrorSnackbar(snackbarError, 'Could not load photos')
    }
  }, [snackbarError])

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
