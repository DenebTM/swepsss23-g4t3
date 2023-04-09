import React, { Dispatch, SetStateAction } from 'react'

import Box from '@mui/material/Box'
import Input, { InputProps } from '@mui/material/Input'
import Slider from '@mui/material/Slider'
import Grid from '@mui/material/Unstable_Grid2'

export interface Value {
  lower: number
  upper: number
}

interface SliderCellProps {
  /** aria label of row title field */
  labelledBy: string
  /** Maximum supported value */
  max: number
  /** Minimum supported value */
  min: number
  /** The current metric value */
  rowValue: Value
  /** Save updated boundary values */
  saveRow: () => Promise<void>
  /** The current metric value */
  setRowValue: Dispatch<SetStateAction<Value>>
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

  /** Save the updated value on slider blur */
  const handleBlur: React.FocusEventHandler = (e) => props.saveRow()

  /** Props for the input elements displaying the current slider values */
  const inputProps: Partial<InputProps> = {
    size: 'small',
    onKeyPress: handleKeyPress,
    onBlur: handleBlur,
    inputProps: {
      step: props.step,
      min: props.min,
      max: props.max,
      type: 'number',
      'aria-labelledby': props.labelledBy,
    },
    sx: { width: '100%' },
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid xs={3}>
          <Input
            value={props.rowValue.lower}
            onChange={(e) =>
              props.setRowValue((oldValue) => ({
                ...oldValue,
                min: Number(e.target.value),
              }))
            }
            {...inputProps}
          />
        </Grid>
        <Grid xs={6}>
          <Slider
            value={Object.values(props.rowValue)}
            onChange={handleSliderChange}
            aria-labelledby={props.labelledBy}
          />
        </Grid>
        <Grid xs={3}>
          <Input
            value={props.rowValue.upper}
            onChange={(e) =>
              props.setRowValue((oldValue) => ({
                ...oldValue,
                max: Number(e.target.value),
              }))
            }
            {...inputProps}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
