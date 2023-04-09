import React, { useState } from 'react'

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
  /** Save updated boundary values */
  saveRow: (newValue: Value) => Promise<void>
  /** Increment steps for the input fields */
  step: number
  /** The current metric value */
  value: Value
}

/**
 * Cell with slider and input fields to update greenhouse boundary values.
 */
export const SliderCell: React.FC<SliderCellProps> = (props) => {
  const [value, setValue] = useState<Value>({
    lower: props.value.lower,
    upper: props.value.upper,
  })

  /** Update value in state on slider change */
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length >= 2) {
      setValue({ lower: newValue[0], upper: newValue[1] })
    }
  }

  /** Update the value in state if updated in the input fields */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //setValue(event.target.value === '' ? '' : Number(event.target.value))
  }

  /** Save the updated value on keypress */
  const handleKeyPress: React.KeyboardEventHandler = (e) =>
    e.key === 'Enter' && props.saveRow(value)

  /** Save the updated value on slider blur */
  const handleBlur: React.FocusEventHandler = (e) => props.saveRow(value)

  /** Props for the input elements displaying the current slider values */
  const inputProps: Partial<InputProps> = {
    size: 'small',
    onChange: handleInputChange,
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
          <Input value={value.lower} {...inputProps} />
        </Grid>
        <Grid xs={6}>
          <Slider
            value={Object.values(value)}
            onChange={handleSliderChange}
            aria-labelledby={props.labelledBy}
          />
        </Grid>
        <Grid xs={3}>
          <Input value={value.upper} {...inputProps} />
        </Grid>
      </Grid>
    </Box>
  )
}
