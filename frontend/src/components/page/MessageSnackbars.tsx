import React from 'react'

import Snackbar from '@mui/material/Snackbar'
import Box from '@mui/system/Box'

import { SnackbarContext } from '~/contexts/SnackbarContext'
import { MessageState } from '~/contexts/types'
import { useRemoveSnackbarMessage } from '~/hooks/snackbar'

/**
 * Renders snackbars for each message in the snackbar context state and deleted messages after a timeout.
 */
export const MessageSnackbars: React.FC<Record<string, never>> = (props) => {
  const { snackbarState } = React.useContext(SnackbarContext)
  const removeSnackbarMessage = useRemoveSnackbarMessage()

  const SNACKBAR_SPACING = '24px' // qqjf add theme spacing and breakpoints for mobile devices

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          bottom: 0,
          right: SNACKBAR_SPACING,
          left: 'auto',
        }}
      >
        {snackbarState.messages.map((msg: MessageState) => (
          <Snackbar
            key={msg.id}
            autoHideDuration={snackbarState.autoHideDuration}
            message={msg.body}
            open
            onClose={() => removeSnackbarMessage(msg.id)}
            sx={{ position: 'initial', paddingBottom: SNACKBAR_SPACING }}
          />
        ))}
      </Box>
    </>
  )
}
