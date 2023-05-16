import React from 'react'
import { useNavigate } from 'react-router-dom'

import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { PlantIcon } from '@component-lib/icons/PlantIcon'
import { PAGE_URL, SensorStationView } from '~/common'
import { SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

interface UploadHeaderProps {
  ssID: SensorStationUuid
}

/**
 * Header component for photo upload page
 */
export const UploadHeader: React.FC<UploadHeaderProps> = (props) => {
  const navigate = useNavigate()

  return (
    <>
      <Box
        component="div"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
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
        Upload your photos of greenhouse {props.ssID} below or{' '}
        <Link
          underline="always"
          color="inherit"
          sx={{ cursor: 'pointer' }}
          onClick={() =>
            navigate(
              PAGE_URL.greenhouseView.href(
                props.ssID,
                SensorStationView.GALLERY
              )
            )
          }
        >
          navigate to the greenhouse gallery
        </Link>
        .
      </Typography>
    </>
  )
}
