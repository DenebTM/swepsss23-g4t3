import React, { useState } from 'react'

import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography, { TypographyTypeMap } from '@mui/material/Typography'

import { SensorValues } from '~/models/measurement'
import { SensorStation } from '~/models/sensorStation'

import { GreenhouseEditableCell } from './EditableCell/GreenhouseEditableCell'
import { EditRowButton } from './EditRowButton'

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    borderTop: '1px solid',
    borderBottom: '1px solid',
    borderColor: theme.outlineVariant,
  },
}))

/** Padding applied to the sides of table rows in theme.spacing units */
const tableRowPadding = 4
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '>td:first-of-type': {
    paddingLeft: theme.spacing(tableRowPadding),
  },
  '>td:last-of-type': {
    paddingRight: theme.spacing(tableRowPadding),
  },
}))

interface GreenhouseAccordionContentsProps {
  sensorStation: SensorStation
}
/**
 * Contents of an expanded greenhoes accordion.
 * Shows options to update greenhouse boundary values and transmission interval.
 */
export const GreenhouseAccordionContents: React.FC<
  GreenhouseAccordionContentsProps
> = (props) => {
  /** Store the key of the row that is currently being edited in the state (otherwise `false`)*/
  const [editing, setEditing] = useState<
    keyof SensorValues | 'aggregationPeriod' | false
  >(false)

  const typographyProps: TypographyTypeMap['props'] = {
    color: 'onSurfaceVariant',
    variant: 'bodyMedium',
  }

  return (
    <TableContainer>
      <Table sx={{ width: '100%' }} aria-label="greenhouse settings table">
        <TableBody>
          {tableRows.map((row: TableRow) => {
            const { title, valueKey, ...editableCellProps } = row
            const ariaLabel = `title-${valueKey}`
            return (
              <StyledTableRow key={valueKey}>
                <StyledTableCell>
                  <Typography {...typographyProps} aria-label={ariaLabel}>
                    {title}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <GreenhouseEditableCell
                    labelledBy={ariaLabel}
                    editing={editing === valueKey}
                    sensorStation={props.sensorStation}
                    typographyProps={typographyProps}
                    valueKey={valueKey}
                    {...editableCellProps}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <EditRowButton onClick={() => setEditing(valueKey)} />
                </StyledTableCell>
              </StyledTableRow>
            )
          })}
          <StyledTableRow>
            <StyledTableCell>
              <Typography {...typographyProps}>Aggregation Period</Typography>
            </StyledTableCell>
            <StyledTableCell align="center">
              <Typography {...typographyProps}>
                {props.sensorStation.aggregationPeriod} seconds
              </Typography>
            </StyledTableCell>
            <StyledTableCell align="right">
              <EditRowButton onClick={() => setEditing('aggregationPeriod')} />
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
