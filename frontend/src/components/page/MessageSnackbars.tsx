import React from 'react'

import Snackbar from '@mui/material/Snackbar'
import Box from '@mui/system/Box'

import { SnackbarContext } from '~/contexts/SnackbarContext/SnackbarContext'
import { MessageState } from '~/contexts/SnackbarContext/types'
import { useRemoveSnackbarMessage } from '~/hooks/snackbar'

/**
 * This component renders a snackbar for each message in the snackbar context state,
 * and deletes messages from the snackbar state once the snackbar is dismissed.
 */
export const MessageSnackbars: React.FC<Record<string, never>> = (props) => {
  const { snackbarState } = React.useContext(SnackbarContext)
  const removeSnackbarMessage = useRemoveSnackbarMessage()

  const SNACKBAR_SPACING = '24px' // qqjf add theme spacing and breakpoints for mobile devices

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        bottom: 0,
        right: SNACKBAR_SPACING,
        left: 'auto',
        zIndex: 1400, // Show in front of main page body. qqjf change to theme.zIndex.snackbar after theme definition.
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
  )
}
