import React, { Dispatch, SetStateAction, useState } from 'react'

import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { theme } from '~/styles/theme'

interface DeleteDialogProps {
  /** Function to run after successful deletion */
  afterDelete?: () => void
  /** A short description of the entity to be deleted. Will be displayed in the dialog title. */
  entityName: string
  handleDelete: () => Promise<void>
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

/**
 * Controlled dialog to confim deleting an object. Shows options to cancel or confirm deletion.
 */
export const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
  const [deletePending, setDeletePending] = useState(false)

  const addSnackbarMessage = useAddSnackbarMessage()
  const handleClose = () => {
    props.setOpen(false)
  }
  /** Set a loading state, delete the entity, and catch errors if needed */
  const handleDelete = () => {
    setDeletePending(true)
    props
      .handleDelete()
      .then(() => {
        props.afterDelete?.()
        handleClose()
        addSnackbarMessage({
          header: `Success`,
          body: `${props.entityName} deleted`,
          type: MessageType.CONFIRM,
        })
      })
      .catch((err: Error) => {
        addSnackbarMessage({
          header: `Could not delete ${props.entityName}`,
          body: err.message,
          type: MessageType.ERROR,
        })
      })
      .finally(() => setDeletePending(false))
  }

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">
        Delete {props.entityName}?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          You will not be able to undo this action
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: theme.onSurfaceVariant,
            borderColor: theme.onSurfaceVariant,
          }}
        >
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleDelete}
          loading={deletePending}
          loadingPosition="center"
          sx={{
            background: theme.error,
            color: theme.onError,
            '&:hover': {
              background: theme.error,
            },
          }}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
