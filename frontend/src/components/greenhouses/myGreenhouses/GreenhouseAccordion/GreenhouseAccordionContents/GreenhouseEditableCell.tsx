import React from 'react'

import Typography, { TypographyTypeMap } from '@mui/material/Typography'

import { SensorValues } from '~/models/measurement'
import { SensorStation } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

interface GreenhouseEditableCellProps {
  editing: boolean
  sensorStation: SensorStation
  typographyProps: TypographyTypeMap['props']
  valueKey: keyof SensorValues
}
/**
 * Contents of an expanded greenhoes accordion.
 * Shows options to update greenhouse boundary values and transmission interval.
 */
export const GreenhouseEditableCell: React.FC<GreenhouseEditableCellProps> = (
  props
) => {
  const rangeValueWidth = '42%'

  return (
    <>
      <Typography
        {...props.typographyProps}
        align="right"
        display="inline-block"
        width={rangeValueWidth}
      >
        {props.sensorStation.lowerBound[props.valueKey]}
      </Typography>
      <Typography
        {...props.typographyProps}
        sx={{ margin: theme.spacing(0, 1) }}
      >
        &#8212;
      </Typography>
      <Typography
        {...props.typographyProps}
        align="left"
        display="inline-block"
        width={rangeValueWidth}
      >
        {props.sensorStation.upperBound[props.valueKey]}
      </Typography>
    </>
  )
}
