import React from 'react'

import Box from '@mui/system/Box'

interface DonutLabelProps {
  /** Distance from bottom of the parent container in px */
  bottom: number
  children: React.ReactNode
}

/**
 * Reusable wrapper to relatively position labels over the GreenhouseDonut component
 */
export const DonutLabel: React.FC<DonutLabelProps> = (props) => {
  return (
    <Box
      sx={{
        position: 'relative',
        bottom: props.bottom,
        width: '100%',
        margin: '0 auto',
        justifyContent: 'center',
        display: 'flex',
      }}
    >
      {props.children}
    </Box>
  )
}
