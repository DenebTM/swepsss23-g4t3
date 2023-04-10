import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'

import { getSensorStations } from '~/api/endpoints/sensorStations/sensorStations'
import { PageWrapper } from '~/components/page/PageWrapper'
import { Message, MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { SensorStation } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

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
  const addSnackbarMessage = useAddSnackbarMessage()
  const [sensorStations, setSensorStations] = useState<SensorStation[]>([])
  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /** Load sensor stations from the API on component mount */
  useEffect(() => {
    const ssPromise = cancelable(getSensorStations())
    loadSensorStations(ssPromise)

    // Cancel the promise callbacks on component unmount
    return ssPromise.cancel
  }, [])

  /** Create a new snackbar if {@link snackbarMessage} has been updated */
  useEffect(() => {
    if (snackbarMessage !== null) {
      addSnackbarMessage(snackbarMessage)
    }
  }, [addSnackbarMessage, snackbarMessage])

  /** Load sensor stations from the backend and set in state */
  const loadSensorStations = (promise: Promise<SensorStation[]>) =>
    promise
      .then((data) => {
        setSensorStations(data)
      })
      .catch((err: Error) =>
        setSnackbarMessage({
          header: 'Could not load sensor stations',
          body: err.message,
          type: MessageType.ERROR,
        })
      )

  return (
    <PageWrapper>
      <PageHeader right={<DashboardFilters />} />
      <Typography variant="headlineLarge" color="onSurface" component="h1">
        Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ padding: theme.spacing(2) }}>
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
          <DashboardCard>
            <DashboardTable sensorStations={sensorStations} />
          </DashboardCard>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}
