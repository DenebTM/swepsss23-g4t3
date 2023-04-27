import React from 'react'

import Grid from '@mui/material/Unstable_Grid2'

import { PAGE_URL } from '~/common'
import { PageWrapper } from '~/components/page/PageWrapper'
import { useSensorStations } from '~/hooks/appContext'

import { DashboardCard } from '../lib/DashboardCard'
import { PageHeader } from '../page/PageHeader'
import { DashboardFilters } from './DashboardFilters'
import { DashboardStatuses } from './DashboardStatuses/DashboardStatuses'
import { DashboardTable } from './DashboardTable/DashboardTable'
import { RecentActivity } from './RecentActivity/RecentActivity'

/**
 * Dashboard page
 */
export const Dashboard: React.FC = () => {
  const sensorStations = useSensorStations()

  return (
    <PageWrapper permittedRoles={PAGE_URL.dashboard.permittedRoles}>
      <PageHeader right={<DashboardFilters />} />

      <Grid container spacing={3} padding={2}>
        {sensorStations && ( // TODO add loading states
          <>
            <Grid xs={12} md={6}>
              <DashboardCard>
                <RecentActivity />
              </DashboardCard>
            </Grid>
            <Grid xs={12} md={6}>
              <DashboardCard>
                <DashboardStatuses sensorStations={sensorStations} />
              </DashboardCard>
            </Grid>
            <Grid xs={12}>
              <DashboardTable sensorStations={sensorStations} />
            </Grid>
          </>
        )}
      </Grid>
    </PageWrapper>
  )
}
