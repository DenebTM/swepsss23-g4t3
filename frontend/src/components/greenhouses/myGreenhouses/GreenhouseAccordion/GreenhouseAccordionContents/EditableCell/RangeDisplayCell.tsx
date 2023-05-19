import React from 'react'

import Typography, { TypographyTypeMap } from '@mui/material/Typography'

import { emDash, ValueRange } from '~/common'
import { theme } from '~/styles/theme'

interface RangeDisplayCellProps {
  /** Display props applied to all child typography components */
  typographyProps: TypographyTypeMap['props']
  /** The unit of the values in the cell */
  unit: string
  /** The current values to display */
  value: ValueRange
  /** Maximum supported value */
  max: number
  /** Minimum supported value */
  min: number
}

/**
 * Display the current range of an editable greenhouse metric range.
 */
export const RangeDisplayCell: React.FC<RangeDisplayCellProps> = (props) => {
  return (
    <>
      <Typography
        {...props.typographyProps}
        align="right"
        display="inline-block"
      >
        {(props.value.lower ?? props.min).toFixed(1)} {props.unit}
      </Typography>
      <Typography
        {...props.typographyProps}
        sx={{ margin: theme.spacing(0, 1), width: '15%' }}
      >
        {emDash}
      </Typography>
      <Typography
        {...props.typographyProps}
        align="left"
        display="inline-block"
      >
        {(props.value.upper ?? props.max).toFixed(1)} {props.unit}
      </Typography>
    </>
  )
}
