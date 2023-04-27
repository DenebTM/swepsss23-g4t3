import React from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { PlantIcon } from '@component-lib/PlantIcon'
import { theme } from '~/styles/theme'

/**
 * Header component for login page
 */
export const LoginHeader: React.FC = () => {
  return (
    <Box component="div" display="flex" alignItems="center" padding={2}>
      <Typography
        variant="headlineLarge"
        align="center"
        color="onSurface"
        component="h1"
        marginRight={1}
      >
        Log in to PlantHealth
      </Typography>
      <PlantIcon color={theme.onSurface} />
    </Box>
  )
}
