import React, { useRef } from 'react'

import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { onEnterKeypress } from '~/common'
import { SensorStation } from '~/models/sensorStation'

import { EditableCellProps } from '../EditableTableRow'

interface AggregationPeriodEditableCellProps extends EditableCellProps<number> {
  /** aria label of row title field */
  labelledBy: string
  /** Minimum supported aggregation period value (in seconds) */
  minAggregationPeriod: number
  /** The sensor station this cell corresponds to */
  sensorStation: SensorStation
}

/**
 * Editable cell to set the aggregation period for an individual access point.
 * Shows options to update value when `editing` is true.
 */
export const AggregationPeriodEditableCell: React.FC<
  AggregationPeriodEditableCellProps
> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const isInvalidValue = props.rowValue < props.minAggregationPeriod

  return props.editing ? (
    <TextField
      required
      label="Aggregation period"
      type="number"
      inputRef={inputRef}
      onKeyPress={onEnterKeypress(props.saveRow)}
      value={props.rowValue}
      fullWidth
      autoFocus
      onChange={(e) => props.setRowValue(Number(e.target.value))}
      error={isInvalidValue}
      sx={{ maxWidth: '12em' }}
      helperText={
        isInvalidValue
          ? `Please enter a value of at least ${props.minAggregationPeriod} seconds`
          : ''
      }
    />
  ) : (
    <Typography {...props.typographyProps}>{props.rowValue} seconds</Typography>
  )
}
