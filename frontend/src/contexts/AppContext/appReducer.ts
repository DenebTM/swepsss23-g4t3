import { Reducer } from 'react'

import { AppReducerAction, AppReducerActions, AppState } from './types'

/**
 * Reducer to update the {@link AppState}
 */
export const appReducer: Reducer<AppState, AppReducerAction> = (
  appState: AppState,
  action: AppReducerAction
) => {
  switch (action.actionType) {
    /** Update sensor stations and lastFetch in the state */
    case AppReducerActions.SET_SENSOR_STATIONS: {
      return {
        ...appState,
        sensorStations: {
          data: action.payload,
          lastFetch: Date.now(),
        },
      }
    }

    /** Remove a single message from the state */
    case AppReducerActions.SET_SIDEBAR_OPEN: {
      return {
        ...appState,
        sidebarOpen: action.payload,
      }
    }

    /** Fallback case */
    default: {
      throw new Error('Unhandled appReducer action type')
    }
  }
}
