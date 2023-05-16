import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import { DashboardCard } from '@component-lib/DashboardCard'
import { getAccessPoints } from '~/api/endpoints/accessPoints'
import { Message, MessageType } from '~/contexts/SnackbarContext/types'
import { useSensorStations } from '~/hooks/appContext'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { AccessPoint } from '~/models/accessPoint'

import { StatusDonutCharts } from './StatusDonutCharts'

/**
 * Component showing the statuses of access points and sensor stations in the dashboard
 */
export const DashboardStatuses: React.FC = (props) => {
  const addSnackbarMessage = useAddSnackbarMessage()
  const sensorStations = useSensorStations()

  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>()
  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /** Load acccess points from the API on component mount */
  useEffect(() => {
    const apPromise = cancelable(getAccessPoints())
    apPromise
      .then((data) => {
        setAccessPoints(data)
      })
      .catch((err: Error) =>
        setSnackbarMessage({
          header: 'Could not load access points',
          body: err.message,
          type: MessageType.ERROR,
        })
      )

    // Cancel the promise callbacks on component unmount
    return apPromise.cancel
  }, [setSnackbarMessage])

  /** Create a new snackbar if {@link snackbarMessage} has been updated */
  useEffect(() => {
    if (snackbarMessage !== null) {
      addSnackbarMessage(snackbarMessage)
    }
  }, [snackbarMessage])

  return (
    <DashboardCard loading={sensorStations === null}>
      {accessPoints && sensorStations && (
        <StatusDonutCharts
          accessPoints={accessPoints}
          sensorStations={sensorStations}
        />
      )}
    </DashboardCard>
  )
}
