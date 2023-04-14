import { SensorValues } from '~/models/measurement'
import { SensorStationUuid } from '~/models/sensorStation'

import { theme } from './styles/theme'

/** The root path for pages relating to greenhouses */
export const GREENHOUSES_ROOT = 'greenhouses'

/** The root path for pages containing admin functions */
const ADMIN_ROOT = 'admin'

/** The root path for photo upload */
export const UPLOAD_ROOT = 'upload'

/** The key of the query parameter for the {@link SensorStationView} */
export const GREENHOUSE_VIEW_QUERY = 'view'

/** The param name of the sensor station ID in sensor station routes */
export const SS_UUID_PARAM = 'sensorStationId'

/** Paths for all frontend URLs */
export const URL = {
  /** Path for admin home */
  adminHome: `/${ADMIN_ROOT}`,

  /** Path for admin to view all logs */
  adminLogs: `/${ADMIN_ROOT}/logs`,

  /** Fallback error page */
  error: '/error',

  /** Main dashboard page */
  dashboard: '/',

  /** Getting started instructions page */
  gettingStarted: '/getting-started',

  /**
   * Pages showing information about a single sensor station.
   * @param sensorStationId The UUID of the sensor station
   * @param view Whether to show the graphical, table, or gallery view. Should be a value in enum {@link SensorStationView}.
   * @returns The relative path to the page
   */
  greenhouseView: (
    sensorStationId: SensorStationUuid,
    view: SensorStationView
  ) => {
    const pathBase = `/${GREENHOUSES_ROOT}/${sensorStationId}`
    if (view === SensorStationView.GRAPHICAL) {
      return pathBase
    } else {
      return `${pathBase}?${GREENHOUSE_VIEW_QUERY}=${view}`
    }
  },

  /** The login page */
  login: '/login',

  /** Path for access point managment by admins */
  manageAccessPoints: `/${ADMIN_ROOT}/access-points`,

  /** Path for sensor station managment by admins */
  manageGreenhouses: `/${ADMIN_ROOT}/${GREENHOUSES_ROOT}`,

  /** Path for user managment by admins */
  manageUsers: `/${ADMIN_ROOT}/users`,

  /** My greenhouses page showing sensor stations assigned to the logged-in user */
  myGreenhouses: `/${GREENHOUSES_ROOT}`,

  /**
   * Page for uploading photos for a single sensor station.
   * TODO qqjf encrypt the sensor station UUID for security
   * @param sensorStationId The UUID of the sensor station
   * @returns The relative path to the page
   */
  photoUpload: (sensorStationId: SensorStationUuid) =>
    `/${UPLOAD_ROOT}/${sensorStationId}`,
}

/** Enum for the URL parameters controlling the view of a single sensor station.
 */
export enum SensorStationView {
  /** The graphical view of sensor station information. */
  GRAPHICAL = '',
  /** The tabuler view of sensor station data */
  TABLE = 'table',
  /** The gallery for a given sensor station */
  GALLERY = 'gallery',
}

/** The key of JWT authorisation cookie */
export const AUTH_JWT = 'AUTH_JWT'

/** URL of the backend */
export const API_DEV_URL = 'http://localhost:8080'

/** Key value for greenhouse settings related to the aggregation period */
export const AGGREGATION_PERIOD = 'aggregationPeriod'

/**
 * Store the current lower and upper bounds for greenhouse sensor values.
 */
export interface ValueRange {
  lower: number
  upper: number
}

/**
 * Helper function to generate an event handler which calls the `callback` on enter keypress
 * @param callback The function to call on enter keyboard press
 * @returns A KeyboardEventHandler
 */
export const onEnterKeypress =
  (callback: () => void): React.KeyboardEventHandler =>
  (event: React.KeyboardEvent) =>
    event.key === 'Enter' && callback()

/** Rounding function for metric values. */
export const roundMetric = (n: number) => n.toFixed(1)

/**
 * Type for a singe greenhouse metric range.
 * Each `GreenhouseMetricRange` will be mapped to a single table row.
 */
export interface GreenhouseMetricRange {
  /** Colour for line colour in charts and graphs */
  colour: string
  /** Description of the metric */
  description?: string
  /** The display name of the metric. */
  displayName: string
  /** Maximum possible supported value. */
  max: number
  /** Minimum possible supported value. */
  min: number
  /**
   * Step size for the input field arrows.
   * Users can manually input other values (in smaller step sizes).
   */
  step: number
  /** The unit of the metric (to be displayed inside the table row). */
  unit: string
  /** The key of the metric inside {@link SensorValues}. */
  valueKey: keyof SensorValues
}

export const GREENHOUSE_METRICS: GreenhouseMetricRange[] = [
  {
    colour: theme.purple,
    displayName: 'Temperature',
    valueKey: 'temperature',
    unit: '°C',
    min: 0,
    max: 65,
    step: 5,
  },
  {
    colour: theme.tertiary,
    displayName: 'Soil Moisture',
    valueKey: 'soilMoisture',
    unit: '%',
    min: 0,
    max: 100,
    step: 5,
  },
  {
    colour: theme.green,
    displayName: 'Light',
    valueKey: 'lightIntensity',
    unit: 'lx',
    min: 10,
    max: 1000,
    step: 20,
  },
  {
    colour: theme.warn,
    displayName: 'Air Pressure',
    valueKey: 'airPressure',
    unit: 'hPa',
    min: 700,
    max: 1300,
    step: 50,
  },
  {
    colour: theme.pink,
    displayName: 'Humidity',
    valueKey: 'humidity',
    unit: '%',
    min: 0,
    max: 100,
    step: 5,
  },
  {
    colour: theme.blue,
    displayName: 'Air Quality',
    description: 'Index of Air Quality (IAQ)',
    valueKey: 'airQuality',
    unit: '',
    min: 0,
    max: 500,
    step: 25,
  },
]

export const greenhouseMetricWithUnit = (
  metricRange: GreenhouseMetricRange
): string =>
  metricRange.displayName +
  (metricRange.unit === '' ? '' : ` (${metricRange.unit})`)

export const emDash = '—'
