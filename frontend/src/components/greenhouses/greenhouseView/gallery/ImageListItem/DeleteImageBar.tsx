import React from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import ImageListItemBar from '@mui/material/ImageListItemBar'

import { Image } from '~/models/image'
import { theme } from '~/styles/theme'

interface DeleteImageBarProps {
  image: Image
  /** Display image bar only if `show` is true. */
  show: boolean
}

/**
 * OVerlay bar with option to delete gallery images.
 */
export const DeleteImageBar: React.FC<DeleteImageBarProps> = (props) => {
  return (
    <Fade in={props.show}>
      <ImageListItemBar
        title="Delete photo"
        actionIcon={
          <IconButton
            size="small"
            sx={{
              color: theme.onErrorContainer,
              background: theme.errorContainer,
              '&:hover': {
                background: theme.ref.error[80],
                transition: theme.transitions.create('background'),
              },
              marginRight: 1,
            }}
            aria-label={`Delete photo ${props.image}`}
          >
            <DeleteIcon />
          </IconButton>
        }
      />
    </Fade>
  )
}
