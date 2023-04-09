import React from 'react'

import Typography, { TypographyTypeMap } from '@mui/material/Typography'

import { theme } from '~/styles/theme'

import { Value } from './SliderCell'

interface RangeDisplayCellProps {
  /** Display props applied to all child typography components */
  typographyProps: TypographyTypeMap['props']
  /** The unit of the values in the cell */
  unit: string
  /** The current values to display */
  value: Value
}

/**
 * Display the current range of an editable greenhouse metric range.
 */
export const RangeDisplayCell: React.FC<RangeDisplayCellProps> = (props) => {
  const rangeValueWidth = '42%'

  return (
    <>
      <Typography
        {...props.typographyProps}
        align="right"
        display="inline-block"
        width={rangeValueWidth}
      >
        {props.value.lower} {props.unit}
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
        {props.value.upper} {props.unit}
      </Typography>
    </>
  )
}
