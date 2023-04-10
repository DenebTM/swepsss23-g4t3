import React, { useState } from 'react'

import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

import { DataGrid } from '@component-lib/DataGrid'
import dayjs from 'dayjs'
import { getSensorStationMeasurements } from '~/api/endpoints/sensorStations/measurements'
import { Measurement } from '~/models/measurement'
import { SensorStationUuid } from '~/models/sensorStation'

/** Round all measurements to the same number of decimal places */
const round = (n: number) => n.toFixed(1)

interface GreenhouseTabularViewProps {
  uuid: SensorStationUuid
}

/**
 * Tabular view of data for a single sensor station
 */
export const GreenhouseTabularView: React.FC<GreenhouseTabularViewProps> = (
  props
) => {
  const [measurements, setMeasurements] = useState<Measurement[]>()

  /** Styles applied to all table columns containing metric */
  const metricColumnParams: Partial<GridColDef<Measurement, any, Measurement>> =
    {
      headerAlign: 'center',
      align: 'center',
      width: 110,
    }

  /**
   * Columns for the greenhouse measurement table.
   * qqjf TODO add units from ~/common to all greenhouse pages.
   */
  const columns: GridColDef<Measurement, any, Measurement>[] = [
    {
      field: 'data.airPressure',
      headerName: 'Air Pressure',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        round(params.row.data.airPressure),
      ...metricColumnParams,
    },
    {
      field: 'data.airQuality',
      headerName: 'Air Quality',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        round(params.row.data.airQuality),
      ...metricColumnParams,
    },
    {
      field: 'data.humidity',
      headerName: 'Humidity',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        round(params.row.data.humidity),
      ...metricColumnParams,
    },
    {
      field: 'data.lightIntensity',
      headerName: 'Light Intensity',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        round(params.row.data.lightIntensity),
      ...metricColumnParams,
    },
    {
      field: 'data.soilMoisture',
      headerName: 'Soil Moisture',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        round(params.row.data.soilMoisture),
      ...metricColumnParams,
    },

    {
      field: 'data.temperature',
      headerName: 'Temperature',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        round(params.row.data.temperature),
      ...metricColumnParams,
    },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      description: 'When the measurement was taken',
      type: 'dateTime',
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        dayjs(params.value).toDate(),
      width: 200,
    },
  ]

  return (
    <DataGrid<Measurement, any, Measurement>
      columns={columns}
      fetchRows={() =>
        getSensorStationMeasurements(
          props.uuid,
          dayjs().subtract(1, 'week').toISOString(),
          dayjs().toISOString()
        )
      }
      getRowId={(row: Measurement) => row.id}
      initialState={{
        sorting: {
          sortModel: [{ field: 'timestamp', sort: 'desc' }],
        },
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      rows={measurements}
      setRows={setMeasurements}
      size="small"
      zebraStripes
    />
  )
}
