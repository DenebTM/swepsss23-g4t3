import React from 'react'

import { SxProps, Theme } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { MessageState, MessageType } from '~/contexts/SnackbarContext/types'

const messageTypographyProps: SxProps<Theme> = {
  color: 'inherit',
  wordBreak: 'break-word',
  display: 'block',
}

interface SnackbarMessageProps {
  borderRadius: string
  message: MessageState
}

/**
 * This component renders a snackbar for each message in the snackbar context state,
 * and deletes messages from the snackbar state once the snackbar is dismissed.
 */
export const SnackbarMessage: React.FC<SnackbarMessageProps> = (props) => {
  const theme = useTheme()

  const snackbarAccents: { [key in MessageType]: string } = {
    [MessageType.CONFIRM]: theme.primary,
    [MessageType.INFO]: theme.tertiary,
    [MessageType.WARN]: theme.warn,
    [MessageType.ERROR]: theme.error,
  }

  return (
    <Box
      sx={{
        padding: '14px 12px 14px 28px',
        width: 'max-content',
        maxWidth: '100%',
        '&::before': {
          content: '""',
          width: theme.spacing(1.5),
          height: '100%',
          background: snackbarAccents[props.message.type],
          top: 0,
          left: 0,
          position: 'absolute',
          borderRadius: `${props.borderRadius} 0 0 ${props.borderRadius}`,
          zIndex: theme.zIndex.snackbar, // Show in front of main page body
        },
      }}
    >
      <Typography variant="titleMedium" sx={messageTypographyProps}>
        {props.message.header}
      </Typography>
      <Typography variant="bodyMedium" sx={messageTypographyProps}>
        {props.message.body}
      </Typography>
    </Box>
  )
}
