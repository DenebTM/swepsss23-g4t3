import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

interface QrDialogHeaderProps {
  handleClose: () => void
  titleId: string
  uuid: SensorStationUuid
}

/**
 * Header component of the QR generation dialog
 */
export const QrDialogHeader: React.FC<QrDialogHeaderProps> = (
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
          Greenhouse {props.uuid}
        </Typography>
        <Typography color="onSurfaceVariant" variant="bodySmall">
          Display this QR code on greenhouses so that users can upload photos
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
