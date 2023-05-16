import { Property } from 'csstype'
import React from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import { ResponsiveStyleValue } from '@mui/system/styleFunctionSx'

import { PlantIcon } from '@component-lib/icons/PlantIcon'
import { theme } from '~/styles/theme'

interface LoginHeaderProps {
  padding?: ResponsiveStyleValue<Property.Padding<string>>
}

/**
 * Header component for login page
 */
export const LoginHeader: React.FC<LoginHeaderProps> = (props) => {
  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: props.padding,
      }}
    >
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
