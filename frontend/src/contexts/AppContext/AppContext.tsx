import React from 'react'

import { AppState, IAppContext } from './types'

export const initialAppState: AppState = {
  sensorStations: {
    data: null,
    lastFetch: 0,
  },
  sidebarOpen: true, // Initially have the sidebar open
}

/** Set default values for the app context */
const initialAppContext: IAppContext = {
  appState: initialAppState,
  setSensorStations: () => {
    /* Do nothing before initialisation */
  },
  setSidebarOpen: (open: boolean) => {
    /* Do nothing before initialisation */
  },
}

/**
 * Context to provide global values throughout App.
 * Note that the context will only be available in children of {@link AppProvider}.
 * For more information on Contexts see https://react.dev/learn/scaling-up-with-reducer-and-context
 */
export const AppContext: React.Context<IAppContext> =
  React.createContext(initialAppContext)
