import React from 'react'

import { getSensorStations } from '~/api/endpoints/sensorStations/sensorStations'
import { AppContext } from '~/contexts/AppContext/AppContext'
import { SensorStation, StationStatus } from '~/models/sensorStation'

import { useAddErrorSnackbar } from './snackbar'

/**
 * Hook to get the current values of the fetched sensor stations in the global AppContext.
 * If the values have not been set yet, then fetches and saves these.
 */
export const useSensorStations = (
  hideAvailable?: boolean
): SensorStation[] | null => {
  const { appState } = React.useContext(AppContext)
  const sensorStations: SensorStation[] | null = appState.sensorStations.data
  const loadSensorStations = useLoadSensorStations()

  // If the sensor stations have not been fetched yet then load them from the API
  if (sensorStations === null) {
    loadSensorStations()
  }

  return hideAvailable
    ? sensorStations?.filter((s) => s.status !== StationStatus.AVAILABLE) ??
        null
    : sensorStations
}

/**
 * Load sensor stations from the backend and saves them in the global {@link AppContext}
 */
export const useLoadSensorStations = (): (() => void) => {
  const { setSensorStations } = React.useContext(AppContext)
  const addErrorSnackbar = useAddErrorSnackbar()

  return () =>
    getSensorStations()
      .then((data) => {
        setSensorStations(data)
      })
      .catch((err: Error) =>
        addErrorSnackbar(err, 'Could not load greenhouses')
      )
}
