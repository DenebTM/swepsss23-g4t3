import React, { Dispatch, SetStateAction, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import ImageListItemBar from '@mui/material/ImageListItemBar'

import { Tooltip } from '@component-lib/Tooltip'
import dayjs from 'dayjs'
import { deletePhoto } from '~/api/endpoints/sensorStations/photos'
import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { Photo } from '~/models/photo'
import { SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

interface DeleteImageBarProps {
  /** The photo to show */
  photo: Photo
  /** Set photos in parent components */
  setPhotos: Dispatch<SetStateAction<Photo[] | undefined>>
  /** Display image bar only if `show` is true. */
  show: boolean
  ssID: SensorStationUuid
}

/**
 * Overlay bar with option to delete gallery photos.
 */
export const DeleteImageBar: React.FC<DeleteImageBarProps> = (props) => {
  const addSnackbarMessage = useAddSnackbarMessage()

  const [deletePending, setDeletePending] = useState(false)

  const handleDeletePhoto = (): void => {
    setDeletePending(true)
    deletePhoto(props.ssID, props.photo.id)
      .then(() => {
        // Remove deleted photo from state
        props.setPhotos((oldPhotos) => {
          if (typeof oldPhotos === 'undefined') {
            return []
          } else {
            return oldPhotos.filter((p) => p.id !== props.photo.id)
          }
        })
        // Show success message
        addSnackbarMessage({
          header: 'Success',
          body: 'Photo deleted',
          type: MessageType.CONFIRM,
        })
      })
      .catch((err: Error) => {
        addSnackbarMessage({
          header: 'Unable to delete photo',
          body: err.message,
          type: MessageType.ERROR,
        })
      })
      .finally(() => setDeletePending(false))
  }

  return (
    <Fade in={props.show}>
      <ImageListItemBar
        title={`Uploaded: ${dayjs(props.photo.uploaded).format('YYYY-MM-DD')}`}
        actionIcon={
          <Tooltip arrow title={deletePending ? 'Deleting...' : 'Delete photo'}>
            <IconButton
              aria-label={`Delete photo ${props.photo.id}`}
              disabled={deletePending}
              onClick={handleDeletePhoto}
              size="small"
              sx={{
                color: theme.onErrorContainer,
                background: theme.errorContainer,
                '&.Mui-disabled': {
                  background: theme.ref.neutral[90],
                  color: theme.ref.neutral[40],
                },
                '&:hover': {
                  background: theme.ref.error[80],
                  transition: theme.transitions.create('background'),
                },
                marginRight: 1,
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        }
      />
    </Fade>
  )
}
