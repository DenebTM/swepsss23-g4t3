import React from 'react'

import { SensorStation } from '~/models/sensorStation'

import { EditableCellProps } from '../EditableTableRow'
import { RangeDisplayCell } from './RangeDisplayCell'
import { SliderCell, Value } from './SliderCell'

interface GreenhouseEditableRangeCellProps extends EditableCellProps<Value> {
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
  /** The unit of the values in the cell */
  unit: string
}

/**
 * Contents of an expanded greenhouse accordion.
 * Shows options to update greenhouse boundary values with a slider and input fields when `editing` is true.
 * Validates updated values to clip them between `minimum` and `maximum`.
 */
export const GreenhouseEditableRangeCell: React.FC<
  GreenhouseEditableRangeCellProps
> = (props) => {
  return props.editing ? (
    <SliderCell
      labelledBy={props.labelledBy}
      max={props.max}
      min={props.min}
      saveRow={props.saveRow}
      step={props.step}
      value={props.rowValue}
    />
  ) : (
    <RangeDisplayCell
      typographyProps={props.typographyProps}
      unit={props.unit}
      value={props.rowValue}
    />
  )
}
