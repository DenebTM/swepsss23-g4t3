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

  /** Columns for the greenhouse measurement table */
  const columns: GridColDef<Measurement, any, Measurement>[] = [
    {
      field: 'data.airPressure',
      headerName: 'Air Pressure',
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        round(params.row.data.airPressure),
    },
    {
      field: 'data.airQuality',
      headerName: 'Air Quality',
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        round(params.row.data.airQuality),
    },
    {
      field: 'data.humidity',
      headerName: 'Humidity',
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        round(params.row.data.humidity),
    },
    {
      field: 'data.lightIntensity',
      headerName: 'Light Intensity',
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        round(params.row.data.lightIntensity),
    },
    {
      field: 'data.soilMoisture',
      headerName: 'Soil Moisture',
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        round(params.row.data.soilMoisture),
    },

    {
      field: 'data.temperature',
      headerName: 'Temperature',
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        round(params.row.data.temperature),
    },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      description: 'When the measurement was taken',
      type: 'dateTime',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams<Measurement, string>) =>
        dayjs(params.value).toDate(),
    },
  ]

  return (
    <DataGrid<Measurement, any, Measurement>
      columns={columns}
      getRowId={(row: Measurement) => row.id}
      rows={measurements}
      setRows={setMeasurements}
      fetchRows={() =>
        getSensorStationMeasurements(
          props.uuid,
          dayjs().subtract(1, 'week').toISOString(),
          dayjs().toISOString()
        )
      }
      initialState={{
        sorting: {
          sortModel: [{ field: 'timestamp', sort: 'desc' }],
        },
      }}
    />
  )
}
