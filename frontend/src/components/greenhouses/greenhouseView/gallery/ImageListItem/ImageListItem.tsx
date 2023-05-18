import React, { Dispatch, SetStateAction, useState } from 'react'

import MuiImageListItem from '@mui/material/ImageListItem'

import { getPhotoByIdUrl } from '~/api/endpoints/sensorStations/photos'
import { useUsername, useUserRole } from '~/hooks/user'
import { Photo } from '~/models/photo'
import { SensorStation } from '~/models/sensorStation'
import { AuthUserRole } from '~/models/user'

import { DeleteImageBar } from './DeleteImageBar'

interface ImageListItemProps {
  /** Photo alt-text */
  alt: string
  /** URL to the images */
  photo: Photo
  /** Update photos in the state of the parent components */
  setPhotos: Dispatch<SetStateAction<Photo[] | undefined>>
  sensorStation: SensorStation | undefined
}

/**
 * Customised ImageList item to allow gardeners and admins to delete images
 */
export const ImageListItem: React.FC<ImageListItemProps> = (props) => {
  const userRole = useUserRole()
  const username = useUsername()

  const [showItemBar, setShowItemBar] = useState(false)

  /**
   * Show the overlay with a button to delete images if the user is an admin
   * or a gardener for this greenhouse
   */
  const handleShowItemBar = () => {
    if (
      userRole === AuthUserRole.ADMIN ||
      (userRole === AuthUserRole.GARDENER &&
        props.sensorStation &&
        props.sensorStation.gardeners.includes(username))
    ) {
      setShowItemBar(true)
    } else {
      setShowItemBar(false)
    }
  }

  return (
    <MuiImageListItem
      onMouseOver={handleShowItemBar}
      onMouseOut={() => setShowItemBar(false)}
    >
      <img
        src={getPhotoByIdUrl(props.photo.id)}
        alt={props.alt}
        loading="lazy"
      />
      <DeleteImageBar
        photo={props.photo}
        setPhotos={props.setPhotos}
        show={showItemBar}
      />
    </MuiImageListItem>
  )
}
