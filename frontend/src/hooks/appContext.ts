/*import React from 'react'

import { getSensorStations } from '~/api/endpoints/sensorStations/sensorStations'
import { AppContext } from '~/contexts/AppContext/AppContext'
import { SnackbarContext } from '~/contexts/SnackbarContext/SnackbarContext'
import { MessageType } from '~/contexts/SnackbarContext/types'*/
import { SensorStation } from '~/models/sensorStation'

/**
 * Hook to get the current values of the fetched sensor stations in the global AppContext.
 * If the values have not been set yet, then fetches and saves these.
 */
export const useSensorStations = (): SensorStation[] | null => []

/*{
  const { appState, setSensorStations } = React.useContext(AppContext)
  const { addMessage } = React.useContext(SnackbarContext)
  const sensorStations: SensorStation[] | null = appState.sensorStations.data

  // If the sensor stations have not been fetched yet then load them from the API
  if (sensorStations === null) {
    getSensorStations()
      .then((data) => {
        setSensorStations(data)
      })
      .catch((err: Error) =>
        addMessage({
          header: 'Could not load greenhouses',
          body: err.message,
          type: MessageType.ERROR,
        })
      )
  }
  return sensorStations
}
*/
