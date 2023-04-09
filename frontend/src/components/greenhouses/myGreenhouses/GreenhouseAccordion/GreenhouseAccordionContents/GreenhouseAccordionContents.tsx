import React, { useState } from 'react'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography, { TypographyTypeMap } from '@mui/material/Typography'

import { updateSensorStation } from '~/api/endpoints/sensorStations/sensorStations'
import { aggregationPeriod } from '~/common'
import { AppContext } from '~/contexts/AppContext/AppContext'
import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { SensorValues } from '~/models/measurement'
import { SensorStation } from '~/models/sensorStation'

import { GreenhouseEditableRangeCell } from './EditableCell/GreenhouseEditableRangeCell'
import { Value } from './EditableCell/SliderCell'
import { EditableCellProps, EditableTableRow } from './EditableTableRow'

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
 * Contents of an expanded greenhoes accordion.
 * Shows options to update greenhouse boundary values and transmission interval.
 */
export const GreenhouseAccordionContents: React.FC<
  GreenhouseAccordionContentsProps
> = (props) => {
  const { setSensorStations } = React.useContext(AppContext)
  const addSnackbarMessage = useAddSnackbarMessage()

  /** Store the key of the row that is currently being edited in the state (otherwise `false`)*/
  const [editing, setEditing] = useState<
    keyof SensorValues | typeof aggregationPeriod | false
  >(false)

  const typographyProps: TypographyTypeMap['props'] = {
    color: 'onSurfaceVariant',
    variant: 'bodyMedium',
  }

  /**
   * Save updated boundary values value in the backend
   * We could check that the value hasn't been updated to reduce calls to the backend.
   * but left it simple for now.
   */
  const handleSaveBoundaryValue = (
    valueKey: keyof SensorValues,
    lower: number,
    upper: number
  ): Promise<void> =>
    handleSaveRow(
      updateSensorStation(props.sensorStation.uuid, {
        lowerBound: {
          ...props.sensorStation.lowerBound,
          [valueKey]: lower,
        },
        upperBound: {
          ...props.sensorStation.upperBound,
          [valueKey]: upper,
        },
      })
    )

  /** Handle saving updated aggregation period or sensor range */
  const handleSaveRow = (
    ssUpdatePromise: Promise<SensorStation>
  ): Promise<void> =>
    ssUpdatePromise
      .then((updatedSs) => {
        // Update sensor station in app context
        setSensorStations((oldValue) => {
          if (oldValue === null) {
            return []
          } else {
            return oldValue.map((s) =>
              s.uuid === props.sensorStation.uuid ? updatedSs : s
            )
          }
        })
      })
      .catch((err: Error) => {
        addSnackbarMessage({
          header: 'Could not load save updated value',
          body: err.message,
          type: MessageType.ERROR,
        })
      })
      .finally(() => {
        setEditing(false)
        return Promise.resolve()
      })

  return (
    <TableContainer>
      <Table sx={{ width: '100%' }} aria-label="greenhouse settings table">
        <TableBody>
          {tableRows.map((row: TableRow) => {
            const ariaLabel = `title-${row.valueKey}`
            return (
              <EditableTableRow<Value>
                key={row.valueKey}
                ariaLabel={ariaLabel}
                editableCell={(editableCellProps: EditableCellProps<Value>) => (
                  <GreenhouseEditableRangeCell
                    labelledBy={ariaLabel}
                    sensorStation={props.sensorStation}
                    {...row}
                    {...editableCellProps}
                  />
                )}
                editing={editing === row.valueKey}
                saveRow={(v: Value) =>
                  handleSaveBoundaryValue(row.valueKey, v.lower, v.upper)
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
              handleSaveRow(
                updateSensorStation(props.sensorStation.uuid, {
                  aggregationPeriod: aggregationPeriod,
                })
              )
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
