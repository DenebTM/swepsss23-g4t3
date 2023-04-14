import React, { Dispatch, SetStateAction } from 'react'

import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import { DataGrid } from '@component-lib/DataGrid'
import { DeleteCell } from '@component-lib/DeleteCell'
import { deleteSensorStation } from '~/api/endpoints/sensorStations/sensorStations'
import { AppContext } from '~/contexts/AppContext/AppContext'
import { useSensorStations } from '~/hooks/appContext'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'

const centerCell: Partial<GridColDef<SensorStation, any, SensorStation>> = {
  headerAlign: 'center',
  align: 'center',
  flex: 1,
}

/**
 * Sensor station managment page for admins
 */
export const SensorStationsTable: React.FC = () => {
  const sensorStations = useSensorStations()
  const { setSensorStations } = React.useContext(AppContext)

  /** Type of a `DataGrid` row */
  type R = SensorStation[] | undefined

  /** Handle row updates */
  const handleUpdateSensorStations: Dispatch<SetStateAction<R>> = (
    newOrUpdateValue: R | ((prevState: R) => R)
  ) => {
    if (typeof newOrUpdateValue === 'undefined') {
      setSensorStations([])
    } else if (Array.isArray(newOrUpdateValue)) {
      setSensorStations(newOrUpdateValue)
    } else {
      setSensorStations(
        (prevState: SensorStation[] | null) =>
          newOrUpdateValue(prevState === null ? undefined : prevState) ?? []
      )
    }
  }

  /** Columns for the access point management table */
  const columns: GridColDef<SensorStation, any, SensorStation>[] = [
    { field: 'uuid', headerName: 'UUID', ...centerCell },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (
        params: GridRenderCellParams<SensorStation, any, SensorStation>
      ) => <div>{JSON.stringify(params.value)}</div>,
      ...centerCell,
    },
    {
      field: 'aggregationPeriod',
      headerName: 'Aggregation Period (s)',
      ...centerCell,
    },
    {
      field: 'accessPoint',
      headerName: 'Access Point',
      renderCell: (
        params: GridRenderCellParams<SensorStation, any, SensorStation>
      ) => <div>{JSON.stringify(params.value)}</div>,
      ...centerCell,
    },
    {
      field: 'gardeners',
      headerName: 'Gardeners',
      description: 'Gardeners assigned to the sensor station',
      renderCell: (
        params: GridRenderCellParams<SensorStation, any, SensorStation>
      ) => <div>{JSON.stringify(params.row.gardeners)}</div>,
      ...centerCell,
    },
    {
      field: 'action',
      headerName: 'Delete',
      description: 'Delete the given sensor sensor',
      sortable: false,
      renderCell: (
        params: GridRenderCellParams<SensorStation, any, SensorStation>
      ) => (
        <DeleteCell<SensorStation, SensorStationUuid>
          deleteEntity={deleteSensorStation}
          entityId={params.row.uuid}
          entityName="sensor station"
          getEntityId={(r) => r.uuid}
          setRows={handleUpdateSensorStations}
        />
      ),
      ...centerCell,
    },
  ]

  return (
    <DataGrid<SensorStation, any, SensorStation>
      columns={columns}
      getRowId={(row: SensorStation) => row.uuid}
      rows={sensorStations}
    />
  )
}
