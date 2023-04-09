import React, { useState } from 'react'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography, { TypographyTypeMap } from '@mui/material/Typography'

import { aggregationPeriod } from '~/common'
import { SensorValues } from '~/models/measurement'
import { SensorStation } from '~/models/sensorStation'

import {
  EditableCellProps,
  EditableTableRow,
  ValueRange,
} from './EditableTableRow'

interface TableRow {
  title: string
  valueKey: keyof SensorValues
  unit: string
  min: number
  max: number
  step: number
}

const tableRows: TableRow[] = [
  {
    title: 'Temperature',
    valueKey: 'temperature',
    unit: '°C',
    min: 0,
    max: 0,
    step: 0.1,
  },
  {
    title: 'Soil Moisture',
    valueKey: 'soilMoisture',
    unit: '%',
    min: 0,
    max: 0,
    step: 0.1,
  },
  {
    title: 'Light',
    valueKey: 'lightIntensity',
    unit: 'lx',
    min: 0,
    max: 0,
    step: 0.1,
  },
  {
    title: 'Air Pressure',
    valueKey: 'airPressure',
    unit: 'hPa',
    min: 0,
    max: 0,
    step: 0.1,
  },
  {
    title: 'Humidity',
    valueKey: 'humidity',
    unit: '%',
    min: 0,
    max: 0,
    step: 0.1,
  },
  {
    title: 'Air Quality',
    valueKey: 'airQuality',
    unit: '',
    min: 0,
    max: 0,
    step: 0.1,
  },
]

interface GreenhouseAccordionContentsProps {
  sensorStation: SensorStation
}
/**
 * Contents of an expanded greenhouse accordion.
 * Shows options to update greenhouse boundary values and aggregation period.
 */
export const GreenhouseAccordionContents: React.FC<
  GreenhouseAccordionContentsProps
> = (props) => {
  /** Store the key of the row that is currently being edited in the state (otherwise `false`)*/
  const [editing, setEditing] = useState<
    keyof SensorValues | typeof aggregationPeriod | false
  >(false)

  /** Props to pass to all child cells in the table */
  const typographyProps: TypographyTypeMap['props'] = {
    color: 'onSurfaceVariant',
    variant: 'bodyMedium',
  }

  /** Handle saving updated aggregation period or sensor range */
  const handleSaveRow = (): Promise<void> => {
    setEditing(false)
    return Promise.resolve()
  }

  return (
    <TableContainer>
      <Table sx={{ width: '100%' }} aria-label="greenhouse settings table">
        <TableBody>
          {tableRows.map((row: TableRow) => {
            const ariaLabel = `title-${row.valueKey}`
            return (
              <EditableTableRow<ValueRange>
                key={row.valueKey}
                ariaLabel={ariaLabel}
                editableCell={(
                  editableCellProps: EditableCellProps<ValueRange>
                ) => <div>Editable cell</div>}
                editing={editing === row.valueKey}
                saveRow={(v: ValueRange) =>
                  handleSaveRow(/** qqjf TODO actually update the values here */)
                }
                startEditing={() => setEditing(row.valueKey)}
                title={row.title}
                typographyProps={typographyProps}
                value={{
                  lower: props.sensorStation.lowerBound[row.valueKey],
                  upper: props.sensorStation.upperBound[row.valueKey],
                }}
              />
            )
          })}
          <EditableTableRow<number>
            ariaLabel={`title-aggregationPeriod`}
            editableCell={(editableCellProps: EditableCellProps<number>) => (
              <Typography {...typographyProps}>
                {props.sensorStation.aggregationPeriod} seconds
              </Typography>
            )}
            editing={editing === aggregationPeriod}
            saveRow={(aggregationPeriod: number) =>
              handleSaveRow(/** qqjf TODO actually update the values here */)
            }
            startEditing={() => setEditing(aggregationPeriod)}
            title="Aggregation Period"
            typographyProps={typographyProps}
            value={props.sensorStation.aggregationPeriod}
          />
        </TableBody>
      </Table>
    </TableContainer>
  )
}
