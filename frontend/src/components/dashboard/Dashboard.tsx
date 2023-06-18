import React, { useEffect } from 'react'

import Grid from '@mui/material/Unstable_Grid2'

import { PAGE_URL } from '~/common'
import { PageWrapper } from '~/components/page/PageWrapper'
import { useLoadSensorStations } from '~/hooks/appContext'

import { PageHeader } from '../page/PageHeader'
import { DashboardStatuses } from './DashboardStatuses/DashboardStatuses'
import { DashboardTable } from './DashboardTable/DashboardTable'
import { RecentActivity } from './RecentActivity/RecentActivity'

/**
 * Dashboard page
 */
export const Dashboard: React.FC = () => {
  const loadSensorStations = useLoadSensorStations()

  /** Load sensor stations on page mount */
  useEffect(() => {
    loadSensorStations()
  }, [])

  return (
    <PageWrapper permittedRoles={PAGE_URL.dashboard.permittedRoles}>
      <PageHeader />

      <Grid container spacing={3} padding={2}>
        <Grid xs={12} md={6}>
          <RecentActivity />
        </Grid>
        <Grid xs={12} md={6}>
          <DashboardStatuses />
        </Grid>
        <Grid xs={12}>
          <DashboardTable />
        </Grid>
      </Grid>
    </PageWrapper>
  )
}
