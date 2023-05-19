import React from 'react'

import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid'

import { DataGrid } from '@component-lib/Table/DataGrid'
import { StatusCell, StatusVariant } from '@component-lib/Table/StatusCell'
import { TablePaper } from '@component-lib/Table/TablePaper'
import dayjs from 'dayjs'
import {
  emDash,
  GREENHOUSE_METRICS,
  GreenhouseMetricRange,
  greenhouseMetricWithUnit,
  roundMetric,
} from '~/common'
import { useSensorStations } from '~/hooks/appContext'
import { SensorStation } from '~/models/sensorStation'

/**
 * Table showing the most recent sensor station data in the dashboard
 */
export const DashboardTable: React.FC = (props) => {
  const sensorStations = useSensorStations()

  /** Styles applied to all table columns containing metric */
  const metricColumnParams: Partial<
    GridColDef<SensorStation, any, SensorStation>
  > = {
    headerAlign: 'center',
    align: 'center',
    width: 135,
  }

  /**
   * Columns for the greenhouse measurement table.
   */
  const columns: GridColDef<SensorStation, any, SensorStation>[] = [
    {
      field: 'ssID',
      headerName: 'Greenhouse',
      valueGetter: (params: GridValueGetterParams<SensorStation, string>) =>
        `Greenhouse ${params.value}`,
      width: 120,
    },
    ...Object.values(GREENHOUSE_METRICS).map(
      (metricRange: GreenhouseMetricRange) => ({
        field: metricRange.valueKey,
        headerName: greenhouseMetricWithUnit(metricRange),
        description: metricRange.description,
        renderCell: (
          params: GridRenderCellParams<SensorStation, any, SensorStation>
        ) => (
          <StatusCell
            justifyContent="center"
            status={
              params.row.currentMeasurement
                ? roundMetric(
                    params.row.currentMeasurement.data[metricRange.valueKey]
                  )
                : emDash
            }
            variant={
              // Check whether values are out of bounds
              (params.row.upperBound &&
                params.row.currentMeasurement &&
                params.row.currentMeasurement.data[metricRange.valueKey] >
                  params.row.upperBound[metricRange.valueKey]) ||
              (params.row.lowerBound &&
                params.row.currentMeasurement &&
                params.row.currentMeasurement.data[metricRange.valueKey] <
                  params.row.lowerBound[metricRange.valueKey])
                ? StatusVariant.WARNING
                : StatusVariant.OK
            }
          />
        ),

        ...metricColumnParams,
      })
    ),
    {
      field: 'timestamp',
      headerName: 'Last Updated',
      description: 'When the measurement was taken',
      type: 'dateTime',
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams<SensorStation, string>) =>
        params.row.currentMeasurement
          ? dayjs(params.row.currentMeasurement.timestamp).toDate()
          : dayjs().toDate(), // Show the current time if no measurements have been logged yet
      width: 175,
    },
  ]

  return (
    <TablePaper>
      <DataGrid<SensorStation, any, SensorStation>
        columns={columns}
        getRowId={(row: SensorStation) => row.ssID}
        rows={sensorStations ?? undefined}
        noRowsMessage="No measurements to display. You will see current values here once you connect at least one greenhouse."
      />
    </TablePaper>
  )
}
