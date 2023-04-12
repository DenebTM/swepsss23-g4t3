import React, { useState } from 'react'

import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid'

import { DataGrid, RowUpdateFunction } from '@component-lib/DataGrid'
import dayjs from 'dayjs'
import {
  getAccessPoints,
  updateAccessPoint,
} from '~/api/endpoints/accessPoints'
import { AccessPoint } from '~/models/accessPoint'

/**
 * Access point managment page for admins
 */
export const AccessPointsAdminTable: React.FC = () => {
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>()

  /** Update a single access point */
  const handleUpdateAp: RowUpdateFunction<AccessPoint> = (
    newAp: AccessPoint,
    oldAp: AccessPoint
  ) => updateAccessPoint(oldAp.apId, newAp)

  /** Columns for the user managmement table */
  const columns: GridColDef<AccessPoint, any, AccessPoint>[] = [
    { field: 'name', headerName: 'Name', flex: 1, editable: true },
    {
      field: 'serverAddress',
      headerName: 'Server Address',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'lastUpdate',
      headerName: 'Last Update',
      description: 'When the access point was last updated',
      type: 'dateTime',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueGetter: (params: GridValueGetterParams<AccessPoint, string>) =>
        dayjs(params.value).toDate(),
    },
    {
      field: 'action',
      headerName: 'Delete',
      description: 'Delete the given access point',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      sortable: false,
      renderCell: (
        params: GridRenderCellParams<AccessPoint, any, AccessPoint>
      ) => <div>Delete AP</div>,
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
