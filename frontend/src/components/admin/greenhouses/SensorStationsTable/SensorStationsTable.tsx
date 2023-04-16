import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import { DataGrid } from '@component-lib/DataGrid'
import { DeleteCell } from '@component-lib/DeleteCell'
import { deleteSensorStation } from '~/api/endpoints/sensorStations/sensorStations'
import { AppContext } from '~/contexts/AppContext/AppContext'
import { useSensorStations } from '~/hooks/appContext'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'

import { GardenerChips } from './GardenerChips'

/** Type of a `DataGrid` row */
type R = SensorStation[] | undefined

const centerCell: Partial<GridColDef<SensorStation, any, SensorStation>> = {
  headerAlign: 'center',
  align: 'center',
}

/**
 * Sensor station managment page for admins
 */
export const SensorStationsTable: React.FC = () => {
  const sensorStations = useSensorStations()
  const { setSensorStations } = React.useContext(AppContext)

  // Store the largest number of gardeners for a single greenhouse as dynamic column width is not supported yet by DataGrid:
  // https://github.com/mui/mui-x/issues/1241
  const [maxGardenersPerGreenhouse, setMaxGardenersPerGreenhouse] =
    useState<number>(1)

  useEffect(() => {
    if (sensorStations === null) {
      setMaxGardenersPerGreenhouse(0)
    } else {
      setMaxGardenersPerGreenhouse(
        sensorStations.reduce((prev: SensorStation, current: SensorStation) =>
          prev.gardeners.length > current.gardeners.length ? prev : current
        ).gardeners.length
      )
    }
  }, [sensorStations])

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
      headerName: 'Access Point ID',
      renderCell: (
        params: GridRenderCellParams<SensorStation, any, SensorStation>
      ) => params.value,
      ...centerCell,
    },
    {
      field: 'gardeners',
      sortable: false,
      filterable: false,
      headerName: 'Gardeners',
      description: 'Gardeners assigned to the sensor station',
      renderCell: (
        params: GridRenderCellParams<SensorStation, any, SensorStation>
      ) => <GardenerChips {...params} />,
      ...centerCell,
      // Dynamic column width is not supported yet, so hard code a width for each chip:
      // https://github.com/mui/mui-x/issues/1241
      width: 135 * maxGardenersPerGreenhouse,
    },
    {
      field: 'action',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      renderCell: (
        params: GridRenderCellParams<SensorStation, any, SensorStation>
      ) => (
        // TODO qqjf add links and actions here
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
