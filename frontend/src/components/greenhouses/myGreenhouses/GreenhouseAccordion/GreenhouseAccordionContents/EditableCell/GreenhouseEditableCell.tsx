import React, { useEffect, useState } from 'react'

import { TypographyTypeMap } from '@mui/material/Typography'

import { updateSensorStation } from '~/api/endpoints/sensorStations/sensorStations'
import { SensorValues } from '~/models/measurement'
import { SensorStation } from '~/models/sensorStation'

import { RangeDisplayCell } from './RangeDisplayCell'
import { SliderCell, Value } from './SliderCell'

interface GreenhouseEditableCellProps {
  /** Show editable view if true */
  editing: boolean
  /** aria label of row title field */
  labelledBy: string
  /** Maximum supported value */
  max: number
  /** Minimum supported value */
  min: number
  /** The sensor station this cell corresponds to */
  sensorStation: SensorStation
  /** Increment steps for the input fields */
  step: number
  /** Display props applied to all child typography components */
  typographyProps: TypographyTypeMap['props']
  /** The unit of the values in the cell */
  unit: string
  /** Key inside the {@link SensorValues} objects of the sensor station */
  valueKey: keyof SensorValues
}

/**
 * Contents of an expanded greenhouse accordion.
 * Shows options to update greenhouse boundary values with a slider and input fields when `editing` is true.
 * Validates updated values to clip them between `minimum` and `maximum`.
 */
export const GreenhouseEditableCell: React.FC<GreenhouseEditableCellProps> = (
  props
) => {
  const [value, setValue] = useState<Value>({
    lower: props.sensorStation.lowerBound[props.valueKey],
    upper: props.sensorStation.upperBound[props.valueKey],
  })

  useEffect(() => {
    setValue({
      lower: props.sensorStation.lowerBound[props.valueKey],
      upper: props.sensorStation.upperBound[props.valueKey],
    })
  }, [props.sensorStation.lowerBound, props.sensorStation.upperBound])

  /** Save the updated value in the backend */
  const handleSaveValue = (
    lower: number,
    upper: number
  ): Promise<SensorStation | void> => {
    if (lower !== value.lower || upper !== value.upper) {
      return updateSensorStation(props.sensorStation.uuid, {
        lowerBound: {
          ...props.sensorStation.lowerBound,
          [props.valueKey]: lower,
        },
        upperBound: {
          ...props.sensorStation.upperBound,
          [props.valueKey]: lower,
        },
      })
    } else {
      return Promise.resolve()
    }
  }

  return props.editing ? (
    <SliderCell
      handleSaveValue={handleSaveValue}
      labelledBy={props.labelledBy}
      max={props.max}
      min={props.min}
      step={props.step}
      value={value}
      valueKey={props.valueKey}
    />
  ) : (
    <RangeDisplayCell
      typographyProps={props.typographyProps}
      unit={props.unit}
      value={value}
    />
  )
}
