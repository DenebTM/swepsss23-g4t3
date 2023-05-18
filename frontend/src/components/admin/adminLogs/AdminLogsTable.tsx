import React, { useState } from 'react'

import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid'

import { DataGrid } from '@component-lib/Table/DataGrid'
import { StatusCell, StatusVariant } from '@component-lib/Table/StatusCell'
import { TablePaper } from '@component-lib/Table/TablePaper'
import dayjs from 'dayjs'
import { getLogs } from '~/api/endpoints/logs'
import { LogEntry, LogLevel } from '~/models/log'

/** Map values from {@link LogLevel} to {@link StatusVariant} for display in {@link StatusCell} */
const logLevelToStatusVariant: { [key in LogLevel]: StatusVariant } = {
  [LogLevel.INFO]: StatusVariant.INFO,
  [LogLevel.WARN]: StatusVariant.WARNING,
  [LogLevel.ERROR]: StatusVariant.ERROR,
}

const centerCell: Partial<GridColDef<LogEntry, any, LogEntry>> = {
  headerAlign: 'center',
  align: 'center',
}

/**
 * Table containing a paginated list of logs
 */
export const AdminLogsTable: React.FC = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>()

  /** Columns for the logs table */
  const columns: GridColDef<LogEntry, any, LogEntry>[] = [
    {
      field: 'origin',
      headerName: 'Origin',
      width: 120,
      valueGetter: (params: GridValueGetterParams<LogEntry, string>) =>
        params.row.origin ? params.row.origin.type.toLowerCase() : 'null',
    },
    {
      ...centerCell,
      field: 'level',
      headerName: 'Level',
      width: 90,
      renderCell: (params: GridRenderCellParams<LogEntry, any, LogEntry>) => (
        <StatusCell
          status={params.row.level.toLowerCase()}
          variant={logLevelToStatusVariant[params.row.level]}
        />
      ),
    },
    {
      field: 'message',
      headerName: 'Message',
      minWidth: 170,
      flex: 1,
    },
    {
      ...centerCell,
      field: 'timestamp',
      headerName: 'Timestamp',
      type: 'dateTime',
      width: 175,
      valueGetter: (params: GridValueGetterParams<LogEntry, string>) =>
        dayjs(params.value).toDate(),
    },
  ]

  return (
    <TablePaper>
      <DataGrid<LogEntry, any, LogEntry>
        columns={columns}
        getRowId={(row: LogEntry) => row.id}
        rows={logEntries}
        setRows={setLogEntries}
        fetchRows={getLogs}
        noRowsMessage="No logs to display"
      />
    </TablePaper>
  )
}
