import React from 'react'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'

interface SsDialogRowProps {
  children: React.ReactNode
  description: string
  row: number
  title: string
}

/**
 * A single action row in the dialog to pair with a new sensor station.
 * Displays a title, description, row number, and action field passed as children.
 */
export const SsDialogRow: React.FC<SsDialogRowProps> = (props): JSX.Element => {
  return (
    <Grid container spacing={2} padding={2}>
      <Grid xs={1}>
        <Typography color="onSurface" align="left" variant="titleLarge">
          {props.row}.
        </Typography>
      </Grid>
      <Grid xs={7} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography color="onSurface" align="left" variant="titleLarge">
          {props.title}
        </Typography>
        <Typography color="onSurfaceVariant" align="left" variant="bodySmall">
          {props.description}
        </Typography>
      </Grid>
      <Grid xs={4}>{props.children}</Grid>
    </Grid>
  )
}
