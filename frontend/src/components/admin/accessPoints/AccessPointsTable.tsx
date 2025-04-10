import React, { useState } from 'react'

import { alpha, useTheme } from '@mui/material/styles'
import {
  gridClasses,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid'

import { DataGrid, RowUpdateFunction } from '@component-lib/Table/DataGrid'
import { DeleteCell } from '@component-lib/Table/DeleteCell'
import {
  StatusCell,
  statusCellMinWidth,
  StatusVariant,
} from '@component-lib/Table/StatusCell'
import { TablePaper } from '@component-lib/Table/TablePaper'
import dayjs from 'dayjs'
import {
  deleteAccessPoint,
  getAccessPoints,
  updateAccessPoint,
} from '~/api/endpoints/accessPoints'
import { useLoadSensorStations } from '~/hooks/appContext'
import { AccessPoint, AccessPointId, ApStatus } from '~/models/accessPoint'

import { AddSensorStation } from './RowActions/AddSensorStation'
import { ConfirmAccessPoint } from './RowActions/ConfirmAccessPoint'
import { SensorStationChips } from './SensorStationChips'

/** Map values from {@link ApStatus} to {@link StatusVariant} for display in {@link StatusCell} */
const apStatusToVariant: { [key in ApStatus]: StatusVariant } = {
  [ApStatus.ONLINE]: StatusVariant.OK,
  [ApStatus.SEARCHING]: StatusVariant.INFO,
  [ApStatus.UNCONFIRMED]: StatusVariant.WARNING,
  [ApStatus.OFFLINE]: StatusVariant.ERROR,
}

const centerCell: Partial<GridColDef<AccessPoint, any, AccessPoint>> = {
  headerAlign: 'center',
  align: 'center',
}

/**
 * Access point management page for admins
 */
export const AccessPointsTable: React.FC = () => {
  const theme = useTheme()

  const loadSensorStations = useLoadSensorStations()
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>()

  /** Update a single access point */
  const handleUpdateAp: RowUpdateFunction<AccessPoint> = (
    newAp: AccessPoint,
    oldAp: AccessPoint
  ) => updateAccessPoint(oldAp.name, newAp)

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
    { field: 'name', headerName: 'Name', width: 140, editable: true },
    {
      ...centerCell,
      field: 'status',
      headerName: 'Status',
      width: statusCellMinWidth,
      renderCell: (
        params: GridRenderCellParams<AccessPoint, any, AccessPoint>
      ) => (
        <StatusCell
          status={params.row.status.toLowerCase()}
          variant={apStatusToVariant[params.row.status]}
        />
      ),
    },
    {
      ...centerCell,
      field: 'serverAddress',
      headerName: 'Server Address',
      width: 130,
    },
    {
      ...centerCell,
      field: 'clientAddress',
      headerName: 'Client Address',
      width: 170,
    },
    {
      field: 'sensorStations',
      headerName: 'Greenhouses',
      description: 'Greenhouses which transmit data to this access point',
      renderCell: (
        params: GridRenderCellParams<AccessPoint, any, AccessPoint>
      ) => <SensorStationChips {...params} setRows={setAccessPoints} />,
      ...centerCell,
      // Dynamic column width is not supported yet, so hard code a width for each chip:
      // https://github.com/mui/mui-x/issues/1241
      width: Math.max(190 * getMaxGreenhousesPerAp(), 100),
    },
    {
      ...centerCell,
      field: 'lastUpdate',
      headerName: 'Last Update',
      description: 'When the access point was last updated',
      type: 'dateTime',
      width: 175,
      valueGetter: (params: GridValueGetterParams<AccessPoint, string>) =>
        dayjs(params.value).toDate(),
    },
    {
      ...centerCell,
      field: 'action',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (
        params: GridRenderCellParams<AccessPoint, any, AccessPoint>
      ) => (
        <DeleteCell<AccessPoint, AccessPointId>
          afterDelete={
            // Reload sensor stations after deleting an access point (due to cascading delete)
            loadSensorStations
          }
          deleteEntity={deleteAccessPoint}
          entityId={params.row.name}
          entityName="access point"
          getEntityId={(r) => r.name}
          setRows={setAccessPoints}
        >
          {params.row.status === ApStatus.UNCONFIRMED ? (
            <ConfirmAccessPoint
              accessPoint={params.row}
              setAccessPoints={setAccessPoints}
            />
          ) : (
            <AddSensorStation
              accessPointId={params.row.name}
              setAccessPoints={setAccessPoints}
              status={params.row.status}
            />
          )}
        </DeleteCell>
      ),
    },
  ]

  return (
    <TablePaper>
      <DataGrid<AccessPoint, any, AccessPoint>
        columns={columns}
        getRowId={(row: AccessPoint) => row.name}
        processRowUpdate={handleUpdateAp}
        rows={accessPoints}
        setRows={setAccessPoints}
        fetchRows={getAccessPoints}
        getRowClassName={(params) => params.row.status}
        sx={{
          [`& .${gridClasses.row}.${ApStatus.UNCONFIRMED}`]: {
            background: alpha(theme.warnContainer, 0.15),
          },
          [`& .${gridClasses.row}.${ApStatus.OFFLINE}`]: {
            background: alpha(theme.errorContainer, 0.15),
          },
        }}
        noRowsMessage="No access points to display"
      />
    </TablePaper>
  )
}
