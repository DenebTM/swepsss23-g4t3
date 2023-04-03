import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Unstable_Grid2'

import { assignGardener } from '~/api/endpoints/sensorStations/gardeners'
import { getSensorStations } from '~/api/endpoints/sensorStations/sensorStations'
import { getUsers } from '~/api/endpoints/user'
import { PageWrapper } from '~/components/page/PageWrapper'
import { Message, MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { SensorStation } from '~/models/sensorStation'
import { UserRole } from '~/models/user'

import { DashboardCard } from './DashboardCard'

/**
 * Dashboard page
 */
export const Dashboard: React.FC = () => {
  const addSnackbarMessage = useAddSnackbarMessage()
  const [sensorStations, setSensorStations] = useState<SensorStation[]>([])
  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /** Load users from the API on component mount and set the value of {@link snackbarMessage} */
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
  }, [snackbarMessage])

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

  /** Demo function to assign a user to the first sensor station found */
  const assignGardenerToSs = () => {
    // qqjf obviously unsafe if sensorStations is empty but this is just a demo
    const sensorStation = sensorStations[0]

    getUsers().then((users) => {
      const unassignedGardeners = users.filter(
        (u) =>
          !sensorStation.gardeners.includes(u.username) &&
          u.role === UserRole.GARDENER
      )
      if (unassignedGardeners.length >= 0) {
        assignGardener(
          sensorStations[0].uuid,
          unassignedGardeners[0].username
        ).then(() => {
          loadSensorStations(getSensorStations())
        })
      } else {
        setSnackbarMessage({
          header: '',
          body: 'No gardeners to assign - try refreshing the page',
          type: MessageType.ERROR,
        })
      }
    })
  }

  return (
    <PageWrapper>
      <h1>Dashboard</h1>
      <h4>Sensor stations before action:</h4>
      <ul>
        {sensorStations.map((s: SensorStation) => (
          <li key={s.uuid}>
            {'Sensor station ' +
              s.uuid +
              ' has gardeners "' +
              s.gardeners +
              '" and AP "' +
              s.accessPoint +
              '"'}
          </li>
        ))}
      </ul>
      <Divider />
      <Button variant="contained" onClick={assignGardenerToSs}>
        Assign a user to sensor station 0
      </Button>

      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <DashboardCard>Recent Activity</DashboardCard>
        </Grid>
        <Grid xs={12} md={6}>
          <DashboardCard>AP and SS Statuses</DashboardCard>
        </Grid>
        <Grid xs={12}>
          <DashboardCard>Dashboard graph</DashboardCard>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}
