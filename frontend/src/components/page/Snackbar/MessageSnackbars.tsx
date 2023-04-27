import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import { SxProps, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { SnackbarContext } from '~/contexts/SnackbarContext/SnackbarContext'
import { MessageState } from '~/contexts/SnackbarContext/types'
import { useRemoveSnackbarMessage } from '~/hooks/snackbar'
import { theme } from '~/styles/theme'

import { SnackbarMessage } from './SnackbarMessage'

const snackbarBorderRadius = '4px'
const snackbarSpacing = '24px'

const snackbarContentStyles: SxProps<Theme> = {
  borderRadius: snackbarBorderRadius,
  padding: 0,
  '&.MuiSnackbarContent-root': {
    minWidth: '360px',
  },
  '> .MuiSnackbarContent-message': {
    padding: 0,
    maxWidth: `calc(100% - ${theme.spacing(6)})`, // Prevent action icon overflowing for long content
  },
  '> .MuiSnackbarContent-action': {
    paddingLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}

/**
 * This component renders a snackbar for each message in the snackbar context state,
 * and deletes messages from the snackbar state once the snackbar is dismissed.
 */
export const MessageSnackbars: React.FC<Record<string, never>> = (props) => {
  const { snackbarState } = React.useContext(SnackbarContext)
  const removeSnackbarMessage = useRemoveSnackbarMessage()
  const smallDisplay = useMediaQuery(theme.breakpoints.down('sm'))

  /** Remove a message with a given id from {@link SnackbarContext} */
  const handleClose = (
    event: Event | React.SyntheticEvent<any, Event>,
    messageId: number,
    reason?: SnackbarCloseReason
  ): void => {
    if (reason === 'clickaway') {
      return
    }

    removeSnackbarMessage(messageId)
  }

  return (
    <Stack
      spacing={snackbarSpacing}
      direction="column"
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        padding: snackbarSpacing,
        alignItems: smallDisplay ? 'center' : 'flex-start',
        zIndex: theme.zIndex.snackbar, // Show in front of main page body
      }}
    >
      {snackbarState.messages.map((msg: MessageState) => (
        <Snackbar
          key={msg.id}
          action={
            <IconButton
              size="small"
              onClick={(e) => handleClose(e, msg.id)}
              sx={{ '&:hover': { background: theme.outline } }}
            >
              <CloseIcon sx={{ color: 'white' }} fontSize="small" />
            </IconButton>
          }
          autoHideDuration={snackbarState.autoHideDuration}
          message={
            <SnackbarMessage
              borderRadius={snackbarBorderRadius}
              message={msg}
            />
          }
          open
          onClose={(e, reason) => handleClose(e, msg.id, reason)}
          ContentProps={{ sx: snackbarContentStyles }}
          sx={{
            position: 'sticky',
            width: smallDisplay ? '100%' : undefined,
          }}
        />
      ))}
    </Stack>
  )
}
