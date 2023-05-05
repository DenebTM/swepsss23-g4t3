import React from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { PlantIcon } from '@component-lib/PlantIcon'
import { SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

interface UploadHeaderProps {
  uuid: SensorStationUuid
}

/**
 * Header component for photo upload page
 */
export const UploadHeader: React.FC<UploadHeaderProps> = (props) => {
  return (
    <>
      <Box
        component="div"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 0.5,
        }}
      >
        <Typography
          variant="headlineMedium"
          color="onSurface"
          align="center"
          sx={{
            marginRight: 0.5,
          }}
        >
          Welcome to PlantHealth
        </Typography>
        <PlantIcon color={theme.onSurface} height={theme.spacing(3)} />
      </Box>
      <Typography
        variant="bodyMedium"
        color="onSurfaceVariant"
        align="center"
        marginBottom={3}
      >
        Upload your photo of greenhouse {props.uuid} below
      </Typography>
    </>
  )
}
