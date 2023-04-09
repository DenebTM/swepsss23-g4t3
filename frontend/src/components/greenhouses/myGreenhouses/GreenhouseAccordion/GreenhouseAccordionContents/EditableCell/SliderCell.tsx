import React, { useState } from 'react'

import Box from '@mui/material/Box'
import Input, { InputProps } from '@mui/material/Input'
import Slider from '@mui/material/Slider'
import Grid from '@mui/material/Unstable_Grid2'

import { SensorValues } from '~/models/measurement'
import { SensorStation } from '~/models/sensorStation'

export interface Value {
  lower: number
  upper: number
}

interface SliderCellProps {
  /** Save updated value */
  handleSaveValue: (
    lower: number,
    upper: number
  ) => Promise<SensorStation | void>
  /** aria label of row title field */
  labelledBy: string
  /** Maximum supported value */
  max: number
  /** Minimum supported value */
  min: number
  /** Increment steps for the input fields */
  step: number
  /** The current mertric value */
  value: Value
  /** Key inside the {@link SensorValues} objects of the sensor station */
  valueKey: keyof SensorValues
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
    e.key === 'Enter' && props.handleSaveValue(value.lower, value.upper)

  /** Save the updated value on slider blur */
  const handleBlur: React.FocusEventHandler = (e) =>
    props.handleSaveValue(value.lower, value.upper)

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
