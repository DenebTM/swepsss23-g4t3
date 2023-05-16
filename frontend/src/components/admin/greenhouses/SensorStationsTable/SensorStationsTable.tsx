import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import { DataGrid } from '@component-lib/Table/DataGrid'
import { DeleteCell } from '@component-lib/Table/DeleteCell'
import {
  StatusCell,
  statusCellMinWidth,
  StatusVariant,
} from '@component-lib/Table/StatusCell'
import { TablePaper } from '@component-lib/Table/TablePaper'
import { deleteSensorStation } from '~/api/endpoints/sensorStations/sensorStations'
import { AppContext } from '~/contexts/AppContext/AppContext'
import { useSensorStations } from '~/hooks/appContext'
import {
  SensorStation,
  SensorStationUuid,
  StationStatus,
} from '~/models/sensorStation'

import { AddGardenerDropdown } from './AddGardenerDropdown/AddGardenerDropdown'
import { GardenerChips } from './GardenerChips'
import { GenerateQrCode } from './GenerateQrCode/GenerateQrCode'

/** Map values from {@link StationStatus} to {@link StatusVariant} for display in {@link StatusCell} */
const sensorStationToVariant: { [key in StationStatus]: StatusVariant } = {
  [StationStatus.OK]: StatusVariant.OK,
  [StationStatus.AVAILABLE]: StatusVariant.OK,
  [StationStatus.WARNING]: StatusVariant.WARNING,
  [StationStatus.PAIRING]: StatusVariant.INFO,
  [StationStatus.OFFLINE]: StatusVariant.ERROR,
  [StationStatus.PAIRING_FAILED]: StatusVariant.ERROR,
}

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
    if (sensorStations === null || sensorStations.length === 0) {
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
    { ...centerCell, flex: 1, field: 'ssID', headerName: 'UUID' },
    {
      ...centerCell,
      field: 'status',
      headerName: 'Status',
      width: statusCellMinWidth,
      renderCell: (
        params: GridRenderCellParams<SensorStation, any, SensorStation>
      ) => (
        <StatusCell
          status={params.row.status.toLowerCase()}
          variant={sensorStationToVariant[params.row.status]}
        />
      ),
    },
    {
      ...centerCell,
      flex: 1,
      field: 'aggregationPeriod',
      headerName: 'Aggregation Period (s)',
    },
    {
      ...centerCell,
      flex: 1,
      field: 'apName',
      headerName: 'Access Point ID',
      renderCell: (
        params: GridRenderCellParams<SensorStation, any, SensorStation>
      ) => params.value,
    },
    {
      ...centerCell,
      field: 'gardeners',
      sortable: false,
      filterable: false,
      headerName: 'Gardeners',
      description: 'Gardeners assigned to this sensor station',
      renderCell: (
        params: GridRenderCellParams<SensorStation, any, SensorStation>
      ) => <GardenerChips {...params} setRows={handleUpdateSensorStations} />,
      // Dynamic column width is not supported yet, so hard code a width for each chip:
      // https://github.com/mui/mui-x/issues/1241
      width: 130 * maxGardenersPerGreenhouse,
    },
    {
      ...centerCell,
      width: 135,
      field: 'action',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      renderCell: (
        params: GridRenderCellParams<SensorStation, any, SensorStation>
      ) => (
        <DeleteCell<SensorStation, SensorStationUuid>
          deleteEntity={deleteSensorStation}
          entityId={params.row.ssID}
          entityName="sensor station"
          getEntityId={(r) => r.ssID}
          setRows={handleUpdateSensorStations}
        >
          <AddGardenerDropdown
            sensorStation={params.row}
            setSensorStations={handleUpdateSensorStations}
          />
          <GenerateQrCode ssID={params.row.ssID} />
        </DeleteCell>
      ),
    },
  ]

  return (
    <TablePaper>
      <DataGrid<SensorStation, any, SensorStation>
        columns={columns}
        getRowId={(row: SensorStation) => row.ssID}
        rows={sensorStations}
      />
    </TablePaper>
  )
}
