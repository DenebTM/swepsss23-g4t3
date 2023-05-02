import React from 'react'

import Typography from '@mui/material/Typography'

import { SensorStation } from '~/models/sensorStation'

import { EditableCellProps } from '../EditableTableRow'

interface AggregationPeriodEditableCellProps extends EditableCellProps<number> {
  /** aria label of row title field */
  labelledBy: string
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
  return props.editing ? (
    <Typography {...props.typographyProps}>
      {props.sensorStation.aggregationPeriod} seconds
    </Typography>
  ) : (
    <Typography {...props.typographyProps}>
      {props.sensorStation.aggregationPeriod} seconds
    </Typography>
  )
}
