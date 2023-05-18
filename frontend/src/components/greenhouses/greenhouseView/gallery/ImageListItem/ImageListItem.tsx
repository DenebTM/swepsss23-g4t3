import React, { Dispatch, SetStateAction, useState } from 'react'

import MuiImageListItem from '@mui/material/ImageListItem'

import { getPhotoByIdUrl } from '~/api/endpoints/sensorStations/photos'
import { useUserRole } from '~/hooks/user'
import { Photo } from '~/models/photo'
import { AuthUserRole, UserRole } from '~/models/user'

import { DeleteImageBar } from './DeleteImageBar'

interface ImageListItemProps {
  /** Photo alt-text */
  alt: string
  /** URL to the images */
  photo: Photo
  /** Update photos in the state of the parent components */
  setPhotos: Dispatch<SetStateAction<Photo[] | undefined>>
}

/**
 * Customised ImageList item to allow gardeners and admins to delete images
 */
export const ImageListItem: React.FC<ImageListItemProps> = (props) => {
  const userRole = useUserRole()
  const [showItemBar, setShowItemBar] = useState(false)

  /** Show the overlay with a button to delete images if the user is a gardener or admin */
  const handleShowItemBar = () => {
    const canDeleteImages: UserRole[] = [
      AuthUserRole.ADMIN,
      AuthUserRole.GARDENER,
    ]
    if (canDeleteImages.includes(userRole)) {
      setShowItemBar(true)
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
