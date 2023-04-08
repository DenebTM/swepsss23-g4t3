import React, { useState } from 'react'

import MuiImageListItem from '@mui/material/ImageListItem'

import { useUserRole } from '~/hooks/user'
import { Image } from '~/models/image'
import { UserRole } from '~/models/user'

import { DeleteImageBar } from './DeleteImageBar'

interface ImageListItemProps {
  /** Image alt-text */
  alt: string
  /** URL to the images */
  image: Image
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
      sx={{
        background: 'blue',
      }}
      onMouseOver={handleShowItemBar}
      onMouseOut={() => setShowItemBar(false)}
    >
      <img
        src={`${props.image.url}?w=248&fit=crop&auto=format`}
        srcSet={`${props.image.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
        alt={props.alt}
        loading="lazy"
      />
      <DeleteImageBar image={props.image} show={showItemBar} />
    </MuiImageListItem>
  )
}
