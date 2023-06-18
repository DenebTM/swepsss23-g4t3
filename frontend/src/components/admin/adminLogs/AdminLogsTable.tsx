import React, { useState } from 'react'

import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid'

import { DataGrid } from '@component-lib/Table/DataGrid'
import {
  DateRangeFilter,
  DateValue,
} from '@component-lib/Table/DateRangeFilter'
import { StatusCell, StatusVariant } from '@component-lib/Table/StatusCell'
import { TablePaper } from '@component-lib/Table/TablePaper'
import dayjs from 'dayjs'
import { getLogs } from '~/api/endpoints/logs'
import { LogEntry, LogLevel } from '~/models/log'

import { LogLevelSelect } from './LogLevelSelect'

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
  const [from, setFrom] = useState<DateValue>(dayjs().subtract(1, 'week'))
  const [to, setTo] = useState<DateValue>(dayjs())
  const [logEntries, setLogEntries] = useState<LogEntry[]>()
  const [level, setLevel] = useState<LogLevel[]>([])

  /** Columns for the logs table */
  const columns: GridColDef<LogEntry, any, LogEntry>[] = [
    {
      field: 'origin',
      headerName: 'Origin',
      width: 150,
      valueGetter: (params: GridValueGetterParams<LogEntry, string>) =>
        ({
          ACCESS_POINT: `AP '${params.row.origin?.id}`,
          SENSOR_STATION: `Sensor Station ${params.row.origin?.id}`,
          USER: `User '${params.row.origin?.id}'`,
          NULL: '-',
        }[params.row.origin?.type ?? 'NULL']),
      filterable: false,
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
      filterable: false,
    },
    {
      field: 'message',
      headerName: 'Message',
      minWidth: 170,
      flex: 1,
      filterable: false,
    },
    {
      ...centerCell,
      field: 'timestamp',
      headerName: 'Timestamp',
      type: 'dateTime',
      width: 175,
      valueGetter: (params: GridValueGetterParams<LogEntry, string>) =>
        dayjs(params.value).toDate(),
      filterable: false,
    },
  ]

  return (
    <TablePaper>
      <DateRangeFilter from={from} to={to} setFrom={setFrom} setTo={setTo}>
        <LogLevelSelect level={level} setLevel={setLevel} />
      </DateRangeFilter>

      <DataGrid<LogEntry, any, LogEntry>
        columns={columns}
        getRowId={(row: LogEntry) => row.id}
        rows={logEntries}
        setRows={setLogEntries}
        fetchRows={(params) => getLogs(params)}
        noRowsMessage="No logs to display"
        params={{
          from: from?.toISOString(),
          to: to?.toISOString(),
          level: level.length > 0 ? level : undefined,
        }}
      />
    </TablePaper>
  )
}
