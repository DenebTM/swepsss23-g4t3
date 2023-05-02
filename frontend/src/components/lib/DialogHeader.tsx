import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { theme } from '~/styles/theme'

interface DialogHeaderProps {
  handleClose: () => void
  subtitle: string
  /** Id of the title element (for a11y props) */
  titleId: string
  title: string
}

/**
 * Header component for a dialog
 * Shows a title, subtitle, and quit icon
 */
export const DialogHeader: React.FC<DialogHeaderProps> = (
  props
): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        padding: theme.spacing(2, 1),
      }}
    >
      <Stack spacing={0.5}>
        <Typography
          color="onSurface"
          variant="headlineMedium"
          id={props.titleId}
        >
          {props.title}
        </Typography>
        <Typography color="onSurfaceVariant" variant="bodySmall">
          {props.subtitle}
        </Typography>
      </Stack>

      <IconButton
        onClick={props.handleClose}
        sx={{
          color: theme.outline,
          height: theme.spacing(6),
          width: theme.spacing(6),
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  )
}
