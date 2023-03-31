import React, { Reducer, useCallback, useMemo, useReducer } from 'react'

import { SensorStation } from '~/models/sensorStation'

import { AppContext, initialAppState } from './AppContext'
import { appReducer } from './appReducer'
import {
  AppReducerAction,
  AppReducerActions,
  AppState,
  IAppContext,
} from './types'

interface AppProviderProps {
  children: React.ReactNode
}

/**
 * Wrapper component to allow accessing global values in child components without prop drilling.
 */
const AppProvider: React.FC<AppProviderProps> = (props) => {
  const [appState, dispatch] = useReducer<
    Reducer<AppState, AppReducerAction>,
    AppState
  >(appReducer, initialAppState, () => initialAppState)

  /** Dispatch action to set sensor stations in the reducer */
  const setSensorStations = useCallback(
    (sensorStations: SensorStation[]) =>
      dispatch({
        payload: sensorStations,
        actionType: AppReducerActions.SET_SENSOR_STATIONS,
      }),
    [dispatch]
  )

  /** Dispatch action to set whether the sidebar is open in the reducer */
  const setSidebarOpen = useCallback(
    (open: boolean) =>
      dispatch({
        payload: open,
        actionType: AppReducerActions.SET_SIDEBAR_OPEN,
      }),
    [dispatch]
  )

  const providerValue: IAppContext = useMemo(
    () => ({
      appState,
      dispatch,
      setSensorStations,
      setSidebarOpen,
    }),
    [appState, dispatch]
  )

  return (
    <AppContext.Provider value={providerValue}>
      {props.children}
    </AppContext.Provider>
  )
}

export { AppProvider }
