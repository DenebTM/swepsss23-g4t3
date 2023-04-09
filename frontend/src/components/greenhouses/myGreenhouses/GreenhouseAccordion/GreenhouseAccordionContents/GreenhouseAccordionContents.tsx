import React from 'react'

import Typography from '@mui/material/Typography'

import { SensorStation } from '~/models/sensorStation'

interface GreenhouseAccordionContentsProps {
  sensorStation: SensorStation
}

/**
 * Contents of an expanded greenhouse accordion.
 * Shows options to update greenhouse boundary values and transmission interval.
 */
export const GreenhouseAccordionContents: React.FC<
  GreenhouseAccordionContentsProps
> = (props) => {
  return <Typography>[to add: accordion contents]</Typography>
}
