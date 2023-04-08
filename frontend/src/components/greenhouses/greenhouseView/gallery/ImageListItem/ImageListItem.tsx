import React, { Dispatch, SetStateAction, useState } from 'react'

import MuiImageListItem from '@mui/material/ImageListItem'

import { useUserRole } from '~/hooks/user'
import { Photo } from '~/models/photo'
import { UserRole } from '~/models/user'

import { DeleteImageBar } from './DeleteImageBar'

interface ImageListItemProps {
  /** Photo alt-text */
  alt: string
  /** URL to the images */
  photo: Photo
  /** Update photos in the state of the parent compoentns */
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
    if ([UserRole.ADMIN, UserRole.GARDENER].includes(userRole)) {
      setShowItemBar(true)
    }
  }

  return (
    <MuiImageListItem
      onMouseOver={handleShowItemBar}
      onMouseOut={() => setShowItemBar(false)}
    >
      <img
        src={`${props.photo.url}?w=248&fit=crop&auto=format`}
        srcSet={`${props.photo.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
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
