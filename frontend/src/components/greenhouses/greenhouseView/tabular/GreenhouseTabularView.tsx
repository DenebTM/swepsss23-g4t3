import React, { useState } from 'react'

import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

import { DataGrid } from '@component-lib/Table/DataGrid'
import {
  DateRangeFilter,
  DateValue,
} from '@component-lib/Table/DateRangeFilter'
import { TablePaper } from '@component-lib/Table/TablePaper'
import dayjs from 'dayjs'
import { getSensorStationMeasurements } from '~/api/endpoints/sensorStations/measurements'
import {
  GREENHOUSE_METRICS,
  GreenhouseMetricRange,
  greenhouseMetricWithUnit,
  roundMetric,
} from '~/common'
import { Measurement } from '~/models/measurement'
import { SensorStationUuid } from '~/models/sensorStation'

interface GreenhouseTabularViewProps {
  ssID: SensorStationUuid
}

/**
 * Tabular view of data for a single sensor station
 */
export const GreenhouseTabularView: React.FC<GreenhouseTabularViewProps> = (
  props
) => {
  const [measurements, setMeasurements] = useState<Measurement[]>()
  const [from, setFrom] = useState<DateValue>(dayjs().subtract(1, 'week'))
  const [to, setTo] = useState<DateValue>(dayjs())

  /** Styles applied to all table columns containing metric */
  const metricColumnParams: Partial<GridColDef<Measurement, any, Measurement>> =
    {
      headerAlign: 'center',
      align: 'center',
      width: 135,
      filterable: false,
    }

  /**
   * Columns for the greenhouse measurement table.
   */
  const columns: GridColDef<Measurement, any, Measurement>[] = [
    ...Object.values(GREENHOUSE_METRICS).map(
      (metricRange: GreenhouseMetricRange) => ({
        field: metricRange.valueKey,
        headerName: greenhouseMetricWithUnit(metricRange),
        description: metricRange.description,
        valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
          roundMetric(params.row.data[metricRange.valueKey]),
        ...metricColumnParams,
      })
    ),
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      description: 'When the measurement was taken',
      type: 'dateTime',
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        dayjs(params.value).toDate(),
      width: 180,
      filterable: false,
    },
  ]

  return (
    <TablePaper>
      <DateRangeFilter from={from} to={to} setFrom={setFrom} setTo={setTo} />

      <DataGrid<Measurement, any, Measurement>
        columns={columns}
        fetchRows={(params) => getSensorStationMeasurements(props.ssID, params)}
        getRowId={(row: Measurement) => row.id}
        initialState={{
          sorting: {
            sortModel: [{ field: 'timestamp', sort: 'desc' }],
          },
        }}
        rows={measurements}
        setRows={setMeasurements}
        size="small"
        zebraStripes
        noRowsMessage="No measurements to display"
        params={{ from: from?.toISOString(), to: to?.toISOString() }}
      />
    </TablePaper>
  )
}
