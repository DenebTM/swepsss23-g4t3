import { SensorStation } from '~/models/sensorStation'

/** The internal state of the global app context */
export interface AppState {
  /** The fetched sensor stations. `null` before first fetch. */
  sensorStations: {
    data: SensorStation[] | null
    lastFetch: EpochTimeStamp
  }

  /** Whether the sidebar is currently open */
  sidebarOpen: boolean
}

export type SetSensorStations = (
  sensorStations:
    | SensorStation[]
    | ((oldValue: SensorStation[] | null) => SensorStation[])
) => void

/** Interface for the global Context for the app */
export interface IAppContext {
  appState: AppState
  dispatch?: React.Dispatch<AppReducerAction>

  /** Set sensor stations and update the `lastFetch` value in the app context */
  setSensorStations: SetSensorStations

  /** Set whether the sidebar is open (or collapsed) */
  setSidebarOpen: (open: boolean) => void
}

/** Base inteface to be inherited by other actions taken by the app reducer */
interface BaseReducerAction {
  payload?: SensorStation[] | boolean
  actionType: AppReducerActions
}

/** Action to set the sensor stations in the context and update the `lastFetch` value */
interface SetSensorStationsAction extends BaseReducerAction {
  actionType: typeof AppReducerActions.SET_SENSOR_STATIONS
  payload: SensorStation[]
}

/** Action to set whether the sidebar is open or collapsed */
interface SetSidebarOpenAction extends BaseReducerAction {
  actionType: typeof AppReducerActions.SET_SIDEBAR_OPEN
  payload: boolean
}

/** Types of possible actions which can be passed to the app reducer */
export type AppReducerAction = SetSensorStationsAction | SetSidebarOpenAction

export enum AppReducerActions {
  SET_SENSOR_STATIONS = 'SET_SENSOR_STATIONS',
  SET_SIDEBAR_OPEN = 'SET_SIDEBAR_OPEN',
}
