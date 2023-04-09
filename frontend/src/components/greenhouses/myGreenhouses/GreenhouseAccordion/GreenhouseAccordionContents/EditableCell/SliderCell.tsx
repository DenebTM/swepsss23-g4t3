import React, { Dispatch, SetStateAction } from 'react'

import Slider from '@mui/material/Slider'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Grid from '@mui/material/Unstable_Grid2'

import { ValueRange } from '~/common'

interface SliderCellProps {
  /** aria label of row title field */
  labelledBy: string
  /** Maximum supported value */
  max: number
  /** Minimum supported value */
  min: number
  /** The current metric value */
  rowValue: ValueRange
  /** Save updated boundary values */
  saveRow: () => Promise<void>
  /** The current metric value */
  setRowValue: Dispatch<SetStateAction<ValueRange>>
  /** Increment steps for the input fields */
  step: number
}

/**
 * Cell with slider and input fields to update greenhouse boundary values.
 */
export const SliderCell: React.FC<SliderCellProps> = (props) => {
  /** Update value in state on slider change */
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length >= 2) {
      props.setRowValue({ lower: newValue[0], upper: newValue[1] })
    }
  }

  /** Save the updated value on keypress */
  const handleKeyPress: React.KeyboardEventHandler = (e) =>
    e.key === 'Enter' && props.saveRow()

  /** Props for the input elements displaying the current slider values */
  const inputProps: Partial<TextFieldProps> = {
    size: 'small',
    variant: 'standard',
    onKeyPress: handleKeyPress,
    inputProps: {
      step: props.step,
      min: props.min,
      max: props.max,
      type: 'number',
      'aria-labelledby': props.labelledBy,
    },
    type: 'number',
    InputLabelProps: {
      shrink: true,
    },
    fullWidth: true,
  }

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid xs={12} sm={3}>
        <TextField
          label="Min"
          value={props.rowValue.lower}
          onChange={(e) =>
            props.setRowValue((oldValue) => ({
              ...oldValue,
              lower: Number(e.target.value),
            }))
          }
          error={
            props.rowValue.upper <= props.rowValue.lower ||
            props.rowValue.lower < props.min
          }
          {...inputProps}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <Slider
          value={Object.values(props.rowValue)}
          onChange={handleSliderChange}
          aria-labelledby={props.labelledBy}
          max={props.max}
          min={props.min}
        />
      </Grid>
      <Grid xs={12} sm={3}>
        <TextField
          label="Max"
          value={props.rowValue.upper}
          onChange={(e) =>
            props.setRowValue((oldValue) => ({
              ...oldValue,
              upper: Number(e.target.value),
            }))
          }
          error={
            props.rowValue.upper <= props.rowValue.lower ||
            props.rowValue.upper > props.max
          }
          {...inputProps}
        />
      </Grid>
    </Grid>
  )
}
