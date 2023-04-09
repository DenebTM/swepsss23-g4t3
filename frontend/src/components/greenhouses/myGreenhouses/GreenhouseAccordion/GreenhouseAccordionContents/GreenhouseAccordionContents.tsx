import React from 'react'

import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography, { TypographyTypeMap } from '@mui/material/Typography'

import { SensorValues } from '~/models/measurement'
import { SensorStation } from '~/models/sensorStation'

import { GreenhouseEditableCell } from './GreenhouseEditableCell'

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
  '>td:first-child': {
    paddingLeft: theme.spacing(tableRowPadding),
  },
  '>td:last-child': {
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
  interface TableRow {
    title: string
    key: keyof SensorValues
    unit: string
  }

  const tableRows: TableRow[] = [
    { title: 'Temperature', key: 'temperature', unit: '°C' },
    { title: 'Soil Moisture', key: 'soilMoisture', unit: '%' },
    { title: 'Light', key: 'lightIntensity', unit: 'lx' },
    { title: 'Air Pressure', key: 'airPressure', unit: 'hPa' },
    { title: 'Humidity', key: 'humidity', unit: '%' },
    { title: 'Air Quality', key: 'airQuality', unit: '' },
  ]

  const typographyProps: TypographyTypeMap['props'] = {
    color: 'onSurfaceVariant',
    variant: 'bodyMedium',
  }

  return (
    <TableContainer>
      <Table sx={{ width: '100%' }} aria-label="greenhouse settings table">
        <TableBody>
          {tableRows.map((row: TableRow) => (
            <StyledTableRow key={row.key}>
              <StyledTableCell>
                <Typography {...typographyProps}>{row.title}</Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <GreenhouseEditableCell
                  valueKey={row.key}
                  sensorStation={props.sensorStation}
                  typographyProps={typographyProps}
                />
              </StyledTableCell>
              <StyledTableCell align="right">Edit</StyledTableCell>
            </StyledTableRow>
          ))}
          <StyledTableRow>
            <StyledTableCell>Aggregation Period</StyledTableCell>
            <StyledTableCell align="center">
              {props.sensorStation.aggregationPeriod} seconds
            </StyledTableCell>
            <StyledTableCell align="right">Edit</StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
