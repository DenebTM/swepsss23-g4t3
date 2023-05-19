import React, { useEffect, useState } from 'react'

import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { DashboardCard } from '@component-lib/DashboardCard'
import dayjs from 'dayjs'
import { getLogs } from '~/api/endpoints/logs'
import { useAddErrorSnackbar } from '~/hooks/snackbar'
import { LogEntry, LogLevel } from '~/models/log'

import { RecentActivityList } from './RecentActivityList'

/**
 * Component to display recent activity in the dashboard
 */
export const RecentActivity: React.FC = () => {
  const addErrorSnackbar = useAddErrorSnackbar()
  const [logEntries, setLogEntries] = useState<LogEntry[]>()

  /** Fetch logs from the last week on component mount */
  useEffect(() => {
    getLogs({
      from: dayjs().subtract(1, 'week').toISOString(),
      to: dayjs().toISOString(),
      level: [LogLevel.WARN, LogLevel.ERROR],
      origin: 'any',
    })
      .then((data) => {
        setLogEntries(data)
      })
      .catch((err: Error) => {
        addErrorSnackbar(err, 'Unable to fetch logs')
      })
  }, [])

  return (
    <DashboardCard
      loading={typeof logEntries === 'undefined'}
      empty={typeof logEntries !== 'undefined' && logEntries.length === 0}
      emptyText="Recent notifications will appear here"
    >
      <Stack sx={{ width: '100%', alignSelf: 'flex-start' }}>
        <Typography color="onSurfaceVariant" variant="titleSmall">
          Recent activity
        </Typography>
        {logEntries && <RecentActivityList logEntries={logEntries} />}
      </Stack>
    </DashboardCard>
  )
}
