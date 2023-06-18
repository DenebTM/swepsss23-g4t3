import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import { SxProps, Theme } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { SnackbarContext } from '~/contexts/SnackbarContext/SnackbarContext'
import { MessageState } from '~/contexts/SnackbarContext/types'
import { useRemoveSnackbarMessage } from '~/hooks/snackbar'

import { SnackbarMessage } from './SnackbarMessage'

const snackbarBorderRadius = '4px'
const snackbarSpacing = '24px'

/**
 * This component renders a snackbar for each message in the snackbar context state,
 * and deletes messages from the snackbar state once the snackbar is dismissed.
 */
export const MessageSnackbars: React.FC<Record<string, never>> = (props) => {
  const theme = useTheme()

  const { snackbarState } = React.useContext(SnackbarContext)
  const removeSnackbarMessage = useRemoveSnackbarMessage()
  const smallDisplay = useMediaQuery(theme.breakpoints.down('sm'))

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

  if (snackbarState.messages.length > 0) {
    return (
      <Stack
        spacing={snackbarSpacing}
        direction="column"
        sx={{
          width: '100%',
          position: 'fixed',
          padding: `${snackbarSpacing} ${snackbarSpacing} 0`, // No bottom padding to avoid hiding logout button
          alignItems: smallDisplay ? 'center' : 'flex-start',
          zIndex: theme.zIndex.snackbar, // Show in front of main page body
          bottom: '36px',
        }}
      >
        {snackbarState.messages.map((msg: MessageState) => (
          <Snackbar
            key={msg.id}
            action={
              <IconButton
                size="small"
                onClick={(e) => handleClose(e, msg.id)}
                sx={{
                  color: 'inherit',
                  '&:hover': { background: theme.outline },
                }}
              >
                <CloseIcon color="inherit" fontSize="small" />
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
  } else {
    return null
  }
}
