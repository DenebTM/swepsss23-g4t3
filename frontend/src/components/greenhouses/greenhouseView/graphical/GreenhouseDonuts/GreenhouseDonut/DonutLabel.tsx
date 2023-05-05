import React from 'react'

import Box from '@mui/system/Box'

import { theme } from '~/styles/theme'

interface DonutLabelProps {
  /** Distance from bottom of the parent container in px */
  bottom: number
  children: React.ReactNode

  outOfRange: boolean
}

/**
 * Reusable wrapper to relatively position labels over the GreenhouseDonut component
 */
export const DonutLabel: React.FC<DonutLabelProps> = (props) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        margin: '0 auto',
        justifyContent: 'center',
        display: 'flex',
        bottom: props.bottom,
        color: props.outOfRange ? theme.error : theme.onSurfaceVariant,
      }}
    >
      {props.children}
    </Box>
  )
}
