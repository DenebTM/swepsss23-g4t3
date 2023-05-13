import React, { useState } from 'react'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { TypographyTypeMap } from '@mui/material/Typography'

import { updateSensorStation } from '~/api/endpoints/sensorStations/sensorStations'
import {
  AGGREGATION_PERIOD,
  GREENHOUSE_METRICS,
  GreenhouseMetricRange,
  ValueRange,
} from '~/common'
import { AppContext } from '~/contexts/AppContext/AppContext'
import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { SensorValues } from '~/models/measurement'
import { SensorStation } from '~/models/sensorStation'

import { AggregationPeriodEditableCell } from './EditableCell/AggregationPeriodEditableCell'
import { GreenhouseEditableRangeCell } from './EditableCell/GreenhouseEditableRangeCell'
import { EditableCellProps, EditableTableRow } from './EditableTableRow'

const aggregationPeriodAriaLabel = 'title-aggregationPeriod'

/** Minimum supported aggregation period value (in seconds) */
const minAggregationPeriod = 20

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
  const { setSensorStations } = React.useContext(AppContext)
  const addSnackbarMessage = useAddSnackbarMessage()

  /** Store the key of the row that is currently being edited in the state (otherwise `false`)*/
  const [editing, setEditing] = useState<
    keyof SensorValues | typeof AGGREGATION_PERIOD | false
  >(false)

  /** Props to pass to all child cells in the table */
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
      updateSensorStation(props.sensorStation.ssID, {
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
              s.ssID === props.sensorStation.ssID ? updatedSs : s
            )
          }
        })
      })
      .catch((err: Error) => {
        addSnackbarMessage({
          header: 'Could not save updated value',
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
          {GREENHOUSE_METRICS.map((row: GreenhouseMetricRange) => {
            const ariaLabel = `title-${row.valueKey}`
            return (
              <EditableTableRow<ValueRange>
                key={row.valueKey}
                ariaLabel={ariaLabel}
                editableCell={(
                  editableCellProps: EditableCellProps<ValueRange>
                ) => (
                  <GreenhouseEditableRangeCell
                    labelledBy={ariaLabel}
                    sensorStation={props.sensorStation}
                    {...row}
                    {...editableCellProps}
                  />
                )}
                editing={editing === row.valueKey}
                saveRow={(v: ValueRange) =>
                  handleSaveBoundaryValue(row.valueKey, v.lower, v.upper)
                }
                startEditing={() => setEditing(row.valueKey)}
                title={row.displayName}
                typographyProps={typographyProps}
                value={{
                  lower: props.sensorStation.lowerBound[row.valueKey],
                  upper: props.sensorStation.upperBound[row.valueKey],
                }}
              />
            )
          })}
          <EditableTableRow<number>
            ariaLabel={aggregationPeriodAriaLabel}
            editableCell={(editableCellProps: EditableCellProps<number>) => (
              <AggregationPeriodEditableCell
                labelledBy={aggregationPeriodAriaLabel}
                minAggregationPeriod={minAggregationPeriod}
                sensorStation={props.sensorStation}
                {...editableCellProps}
              />
            )}
            editing={editing === AGGREGATION_PERIOD}
            saveRow={(newValue: number) =>
              handleSaveRow(
                updateSensorStation(props.sensorStation.ssID, {
                  aggregationPeriod: Math.max(minAggregationPeriod, newValue),
                })
              )
            }
            startEditing={() => setEditing(AGGREGATION_PERIOD)}
            title="Aggregation Period"
            typographyProps={typographyProps}
            value={props.sensorStation.aggregationPeriod}
          />
        </TableBody>
      </Table>
    </TableContainer>
  )
}
