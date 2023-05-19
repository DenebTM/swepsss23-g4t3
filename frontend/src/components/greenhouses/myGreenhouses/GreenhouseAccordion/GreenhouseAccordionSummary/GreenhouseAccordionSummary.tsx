import React from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'

import { SensorStation } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { AccordionQuickActions } from './AccordionQuickActions'

interface GreenhouseAccordionSummaryProps {
  sensorStation: SensorStation
}

/**
 * Accordion summary for greeenhouses accordion.
 * Shows the greenhouse status and links to useful pages.
 */
export const GreenhouseAccordionSummary: React.FC<
  GreenhouseAccordionSummaryProps
> = (props) => {
  return (
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: theme.outline }} />}
      sx={{ borderBottom: `${theme.outlineVariant} 1px solid` }}
    >
      <Grid
        container
        alignItems="center"
        width="100%"
        spacing={1}
        color="onSurfaceVariant"
      >
        <Grid sm={12} md={3}>
          <Typography color="onSurface">
            Greenhouse {String(props.sensorStation.ssID)}
          </Typography>
        </Grid>
        <Grid sm={12} md={4}>
          <Typography>
            Status: {props.sensorStation.status.toLowerCase()}
          </Typography>
        </Grid>
        <Grid sm={12} md={5}>
          <AccordionQuickActions sensorStationUuid={props.sensorStation.ssID} />
        </Grid>
      </Grid>
    </AccordionSummary>
  )
}
