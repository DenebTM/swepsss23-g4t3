import React, {
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react'

import useMediaQuery from '@mui/material/useMediaQuery'

import { SensorStation } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

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
  const breakMd = useMediaQuery(theme.breakpoints.down('md'))
  const [appState, dispatch] = useReducer<
    Reducer<AppState, AppReducerAction>,
    AppState
  >(appReducer, initialAppState, () => initialAppState)

  /** Auto-hide the sidebar on narrower screens on page load */
  useEffect(() => {
    setSidebarOpen(!breakMd)
  }, [])

  /** Dispatch action to set sensor stations in the reducer */
  const setSensorStations = useCallback(
    (
      newOrUpdateValue:
        | SensorStation[]
        | ((oldValue: SensorStation[] | null) => SensorStation[])
    ) => {
      let newSs: SensorStation[]
      if (Array.isArray(newOrUpdateValue)) {
        newSs = newOrUpdateValue
      } else {
        newSs = newOrUpdateValue(appState.sensorStations.data)
      }

      dispatch({
        payload: newSs,
        actionType: AppReducerActions.SET_SENSOR_STATIONS,
      })
    },
    [dispatch, appState.sensorStations]
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
