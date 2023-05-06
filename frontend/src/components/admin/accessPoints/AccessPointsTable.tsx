import React, { useState } from 'react'

import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid'

import { DataGrid, RowUpdateFunction } from '@component-lib/Table/DataGrid'
import { DeleteCell } from '@component-lib/Table/DeleteCell'
import { StatusCell, StatusVariant } from '@component-lib/Table/StatusCell'
import dayjs from 'dayjs'
import {
  deleteAccessPoint,
  getAccessPoints,
  updateAccessPoint,
} from '~/api/endpoints/accessPoints'
import { AccessPoint, AccessPointId } from '~/models/accessPoint'

import { AddSensorStation } from './AddSensorStation/AddSensorStation'
import { SensorStationChips } from './SensorStationChips'

const centerCell: Partial<GridColDef<AccessPoint, any, AccessPoint>> = {
  headerAlign: 'center',
  align: 'center',
}

/**
 * Access point managment page for admins
 */
export const AccessPointsTable: React.FC = () => {
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>()

  /** Update a single access point */
  const handleUpdateAp: RowUpdateFunction<AccessPoint> = (
    newAp: AccessPoint,
    oldAp: AccessPoint
  ) => updateAccessPoint(oldAp.apId, newAp)

  /**
   * Calculate the largest number of sensor stations assigned to a single access point as dynamic
   * column width is not supported yet by DataGrid: https://github.com/mui/mui-x/issues/1241
   */
  const getMaxGreenhousesPerAp = (): number =>
    typeof accessPoints === 'undefined' || accessPoints.length === 0
      ? 1
      : accessPoints.reduce((prev: AccessPoint, current: AccessPoint) =>
          prev.sensorStations.length > current.sensorStations.length
            ? prev
            : current
        ).sensorStations.length

  /** Columns for the access point management table */
  const columns: GridColDef<AccessPoint, any, AccessPoint>[] = [
    { field: 'name', headerName: 'Name', flex: 1, editable: true },
    {
      ...centerCell,
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (
        params: GridRenderCellParams<AccessPoint, any, AccessPoint>
      ) => (
        <StatusCell
          status={params.row.active ? 'online' : 'offline'}
          variant={params.row.active ? StatusVariant.OK : StatusVariant.ERROR}
        />
      ),
    },
    {
      ...centerCell,
      field: 'serverAddress',
      headerName: 'Server Address',
      flex: 1,
    },
    {
      field: 'sensorStations',
      headerName: 'Greenhouses',
      description: 'Greenhouses which transmit data to this access point',
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<AccessPoint, any, AccessPoint>
      ) => <SensorStationChips {...params} setRows={setAccessPoints} />,
      ...centerCell,
      // Dynamic column width is not supported yet, so hard code a width for each chip:
      // https://github.com/mui/mui-x/issues/1241
      width: 105 * getMaxGreenhousesPerAp(),
    },
    {
      ...centerCell,
      field: 'lastUpdate',
      headerName: 'Last Update',
      description: 'When the access point was last updated',
      type: 'dateTime',
      flex: 1,
      valueGetter: (params: GridValueGetterParams<AccessPoint, string>) =>
        dayjs(params.value).toDate(),
    },
    {
      ...centerCell,
      field: 'action',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (
        params: GridRenderCellParams<AccessPoint, any, AccessPoint>
      ) => (
        <DeleteCell<AccessPoint, AccessPointId>
          deleteEntity={deleteAccessPoint}
          entityId={params.row.apId}
          entityName="access point"
          getEntityId={(r) => r.apId}
          setRows={setAccessPoints}
        >
          <AddSensorStation accessPointId={params.row.apId} />
        </DeleteCell>
      ),
    },
  ]

  return (
    <DataGrid<AccessPoint, any, AccessPoint>
      columns={columns}
      getRowId={(row: AccessPoint) => row.apId}
      processRowUpdate={handleUpdateAp}
      rows={accessPoints}
      setRows={setAccessPoints}
      fetchRows={getAccessPoints}
    />
  )
}
