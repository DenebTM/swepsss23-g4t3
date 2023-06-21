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
import { useAddErrorSnackbar } from '~/hooks/snackbar'
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
  const addErrorSnackbar = useAddErrorSnackbar()

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
          ...(props.sensorStation.lowerBound ?? {}),
          [valueKey]: lower,
        },
        upperBound: {
          ...(props.sensorStation.upperBound ?? {}),
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
        addErrorSnackbar(err, 'Could not save updated value')
      })
      .finally(() => {
        setEditing(false)
        return Promise.resolve()
      })

  const saveRow = (v: ValueRange, row: GreenhouseMetricRange) =>
    typeof v.lower === 'undefined' || typeof v.upper === 'undefined'
      ? Promise.reject({
          message: 'Both upper and lower boundaries must be set',
        })
      : handleSaveBoundaryValue(row.valueKey, v.lower, v.upper)

  return (
    <TableContainer>
      <Table sx={{ width: '100%' }} aria-label="greenhouse settings table">
        <TableBody>
          {Object.values(GREENHOUSE_METRICS).map(
            (row: GreenhouseMetricRange) => {
              const ariaLabel = `title-${row.valueKey}`
              return (
                <EditableTableRow<ValueRange>
                  key={row.valueKey}
                  ariaLabel={ariaLabel}
                  editableCell={React.useCallback(
                    (editableCellProps: EditableCellProps<ValueRange>) => (
                      <GreenhouseEditableRangeCell
                        labelledBy={ariaLabel}
                        sensorStation={props.sensorStation}
                        {...row}
                        {...editableCellProps}
                      />
                    ),
                    [row.valueKey, props.sensorStation]
                  )}
                  editing={editing === row.valueKey}
                  saveRow={(v: ValueRange) => saveRow(v, row)}
                  startEditing={() => setEditing(row.valueKey)}
                  title={row.displayName}
                  typographyProps={typographyProps}
                  value={{
                    lower: props.sensorStation.lowerBound
                      ? props.sensorStation.lowerBound[row.valueKey]
                      : row.min,
                    upper: props.sensorStation.upperBound
                      ? props.sensorStation.upperBound[row.valueKey]
                      : row.max,
                  }}
                />
              )
            }
          )}
          <EditableTableRow<number>
            ariaLabel={aggregationPeriodAriaLabel}
            editableCell={React.useCallback(
              (editableCellProps: EditableCellProps<number>) => (
                <AggregationPeriodEditableCell
                  labelledBy={aggregationPeriodAriaLabel}
                  minAggregationPeriod={minAggregationPeriod}
                  sensorStation={props.sensorStation}
                  {...editableCellProps}
                />
              ),
              [props.sensorStation]
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
