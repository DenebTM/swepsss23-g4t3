import React from 'react'

import Typography, { TypographyTypeMap } from '@mui/material/Typography'

import { SensorValues } from '~/models/measurement'
import { SensorStation } from '~/models/sensorStation'

interface GreenhouseEditableCellProps {
  valueKey: keyof SensorValues
  sensorStation: SensorStation
  typographyProps: TypographyTypeMap['props']
}
/**
 * Contents of an expanded greenhoes accordion.
 * Shows options to update greenhouse boundary values and transmission interval.
 */
export const GreenhouseEditableCell: React.FC<GreenhouseEditableCellProps> = (
  props
) => {
  console.log(props)

  return (
    <>
      <Typography {...props.typographyProps}>
        {props.sensorStation.lowerBound[props.valueKey]}
      </Typography>
      <Typography {...props.typographyProps}>&#8212;</Typography>

      <Typography {...props.typographyProps}>
        {props.sensorStation.upperBound[props.valueKey]}
      </Typography>
    </>
  )
}
