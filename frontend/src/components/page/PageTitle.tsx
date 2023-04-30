import React from 'react'

import Typography from '@mui/material/Typography'

/**
 * Page title component
 */
export const PageTitle: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <Typography
      variant="headlineSmall"
      align="center"
      color="onSurface"
      component="h1"
    >
      {props.children}
    </Typography>
  )
}
