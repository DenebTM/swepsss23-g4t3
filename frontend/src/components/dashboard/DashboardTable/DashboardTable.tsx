import React from 'react'

import Paper from '@mui/material/Paper'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

import { DataGrid } from '@component-lib/Table/DataGrid'
import dayjs from 'dayjs'
import {
  emDash,
  GREENHOUSE_METRICS,
  GreenhouseMetricRange,
  greenhouseMetricWithUnit,
  roundMetric,
} from '~/common'
import { SensorStation } from '~/models/sensorStation'

interface DashboardTableProps {
  /** The fetched sensor stations */
  sensorStations: SensorStation[]
}

/**
 * Table showing the most recent sensor station data in the dashboard
 */
export const DashboardTable: React.FC<DashboardTableProps> = (props) => {
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
    ...GREENHOUSE_METRICS.map((metricRange: GreenhouseMetricRange) => ({
      field: metricRange.valueKey,
      headerName: greenhouseMetricWithUnit(metricRange),
      description: metricRange.description,
      valueGetter: (params: GridValueGetterParams<SensorStation, string>) =>
        params.row.currentMeasurement
          ? roundMetric(
              params.row.currentMeasurement.data[metricRange.valueKey]
            )
          : emDash,
      ...metricColumnParams,
    })),
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
    <Paper>
      <DataGrid<SensorStation, any, SensorStation>
        columns={columns}
        getRowId={(row: SensorStation) => row.ssID}
        rows={props.sensorStations}
      />
    </Paper>
  )
}
