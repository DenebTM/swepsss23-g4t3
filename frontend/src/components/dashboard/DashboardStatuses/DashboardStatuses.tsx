import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import { DashboardCard } from '@component-lib/DashboardCard'
import { getAccessPoints } from '~/api/endpoints/accessPoints'
import { useSensorStations } from '~/hooks/appContext'
import { useAddErrorSnackbar } from '~/hooks/snackbar'
import { AccessPoint } from '~/models/accessPoint'

import { StatusDonutCharts } from './StatusDonutCharts'

/**
 * Component showing the statuses of access points and sensor stations in the dashboard
 */
export const DashboardStatuses: React.FC = (props) => {
  const addErrorSnackbar = useAddErrorSnackbar()
  const sensorStations = useSensorStations()

  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>()
  const [snackbarError, setSnackbarError] = useState<Error | null>(null)

  /** Load acccess points from the API on component mount */
  useEffect(() => {
    const apPromise = cancelable(getAccessPoints())
    apPromise
      .then((data) => {
        setAccessPoints(data)
      })
      .catch((err: Error) => setSnackbarError(err))

    // Cancel the promise callbacks on component unmount
    return apPromise.cancel
  }, [setSnackbarError])

  /** Create a new snackbar if {@link snackbarError} has been updated */
  useEffect(() => {
    if (snackbarError !== null) {
      addErrorSnackbar(snackbarError, 'Could not load access points')
    }
  }, [snackbarError])

  return (
    <DashboardCard
      loading={sensorStations === null || typeof accessPoints === 'undefined'}
      empty={
        accessPoints &&
        accessPoints.length === 0 &&
        sensorStations !== null &&
        sensorStations.length === 0
      }
      emptyText="Current status information for access points and sensor stations will be displayed here."
    >
      {accessPoints && sensorStations && (
        <StatusDonutCharts
          accessPoints={accessPoints}
          sensorStations={sensorStations}
        />
      )}
    </DashboardCard>
  )
}
