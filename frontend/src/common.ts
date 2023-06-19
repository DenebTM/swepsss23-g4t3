import CryptoJS from 'crypto-js'

import DashboardIcon from '@mui/icons-material/Dashboard'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import YardIcon from '@mui/icons-material/Yard'
import { SvgIconTypeMap } from '@mui/material/SvgIcon'

import GalleryIcon from '@component-lib/icons/GalleryIcon'
import { SensorValues } from '~/models/measurement'

import { SensorStationUuid } from './models/sensorStation'
import { AuthUserRole, GuestRole, UserRole } from './models/user'
import { customColours } from './styles/colours/themeColours'

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

const _ALL_ROLES = [...Object.values(AuthUserRole), ...Object.values(GuestRole)]

/**
 * Paths for all frontend URLs.
 * Each value can have the following properties:
 *
 * @param href Value or function to generate the relative URL of the page
 * @param pageTitle The display title of the page
 * @param permittedRoles User roles allowed to view the page if these should be restricted.
 *
 */
export const PAGE_URL: {
  [key: string]: {
    pageTitle: any
    href: any
    permittedRoles: UserRole[] | any
  }
} = {
  /** Path for admin home */
  adminHome: {
    pageTitle: 'Admin Home',
    href: `/${ADMIN_ROOT}`,
    permittedRoles: [AuthUserRole.ADMIN],
  },

  /** Path for admin to view all logs */
  adminLogs: {
    pageTitle: 'Logs',
    href: `/${ADMIN_ROOT}/logs`,
    permittedRoles: [AuthUserRole.ADMIN],
  },

  /** Fallback error page */
  error: {
    pageTitle: 'Error',
    href: '/error',
    permittedRoles: _ALL_ROLES,
  },

  /** Main dashboard page */
  dashboard: {
    pageTitle: 'Dashboard',
    href: '/',
    permittedRoles: Object.values(AuthUserRole),
  },

  /** Getting started instructions page */
  gettingStarted: {
    pageTitle: 'Getting Started',
    href: '/getting-started',
    permittedRoles: _ALL_ROLES,
  },

  /**
   * Pages showing information about a single sensor station.
   * @param sensorStationId The UUID of the sensor station
   * @param view Whether to show the graphical, table, or gallery view. Should be a value in enum {@link SensorStationView}.
   * @returns The relative path to the page
   */
  greenhouseView: {
    pageTitle: (sensorStationId: SensorStationUuid) =>
      `Greenhouse ${sensorStationId}`,
    href: (sensorStationId: SensorStationUuid, view: SensorStationView) => {
      const pathBase = `/${GREENHOUSES_ROOT}/${sensorStationId}`
      if (view === SensorStationView.GRAPHICAL) {
        return pathBase
      } else {
        return `${pathBase}?${GREENHOUSE_VIEW_QUERY}=${view}`
      }
    },
    permittedRoles: (view: SensorStationView) =>
      view === SensorStationView.GALLERY
        ? _ALL_ROLES
        : Object.values(AuthUserRole),
  },

  /** The login page */
  login: {
    pageTitle: 'Log In',
    href: '/login',
    permittedRoles: _ALL_ROLES,
  },

  /** Path for access point management by admins */
  manageAccessPoints: {
    pageTitle: 'Access Points',
    href: `/${ADMIN_ROOT}/access-points`,
    permittedRoles: [AuthUserRole.ADMIN],
  },

  /** Path for sensor station management by admins */
  manageGreenhouses: {
    pageTitle: 'Greenhouses',
    href: `/${ADMIN_ROOT}/${GREENHOUSES_ROOT}`,
    permittedRoles: [AuthUserRole.ADMIN],
  },

  /** Path for user management by admins */
  manageUsers: {
    pageTitle: 'Users',
    href: `/${ADMIN_ROOT}/users`,
    permittedRoles: [AuthUserRole.ADMIN],
  },

  /** My greenhouses page showing sensor stations assigned to the logged-in user */
  myGreenhouses: {
    pageTitle: 'My Greenhouses',
    href: `/${GREENHOUSES_ROOT}`,
    permittedRoles: [AuthUserRole.ADMIN, AuthUserRole.GARDENER],
  },

  /**
   * Page for uploading photos for a single sensor station.
   */
  photoUpload: {
    pageTitle: 'Photo Upload',
    href: (sensorStationId: SensorStationUuid) =>
      `/${UPLOAD_ROOT}?${SS_UUID_PARAM}=${encryptSensorStationUuid(
        sensorStationId
      )}`,
    permittedRoles: _ALL_ROLES,
  },
}

/** Icon used for greenhouses in the sidebar and tables */
export const GreenhouseIcon = YardIcon

/** Salt used to encrypt and decrypt sensor station UUIDs for photo upload */
const SECRET = 'zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI'

/** Encrypt a sensor station UUID for photo upload */
export const encryptSensorStationUuid = (ssID: SensorStationUuid): string =>
  encodeURIComponent(CryptoJS.AES.encrypt(String(ssID), SECRET).toString())

/** Decrypt a sensor station UUID for photo upload */
export const decryptSensorStationUuid = (
  uri: string
): SensorStationUuid | undefined => {
  try {
    const stringUuid = CryptoJS.AES.decrypt(uri, SECRET).toString(
      CryptoJS.enc.Utf8
    )
    return stringUuid === '' ? undefined : Number(stringUuid)
  } catch (error) {
    // If the data can not be parsed as UTF-8 then catch this here
    return undefined
  }
}

/** The key of JWT authorisation cookie */
export const AUTH_JWT = 'AUTH_JWT'

/** URL of the backend */
export const API_DEV_URL = import.meta.env.VITE_DEV_BACKEND ?? ''

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

export const NON_AIR_METRICS: { [key: string]: GreenhouseMetricRange } = {
  temperature: {
    colour: customColours.purple,
    displayName: 'Temperature',
    valueKey: 'temperature',
    unit: '°C',
    min: 0,
    max: 65,
    step: 5,
  },
  soilMoisture: {
    colour: customColours.tertiary,
    displayName: 'Soil Moisture',
    valueKey: 'soilMoisture',
    unit: '%',
    min: 0,
    max: 100,
    step: 5,
  },
  lightIntensity: {
    colour: customColours.green,
    displayName: 'Light',
    valueKey: 'lightIntensity',
    unit: 'lx',
    min: 0,
    max: 1200,
    step: 20,
  },
}

export const AIR_METRICS: { [key: string]: GreenhouseMetricRange } = {
  airPressure: {
    colour: customColours.warn,
    displayName: 'Air Pressure',
    valueKey: 'airPressure',
    unit: 'hPa',
    min: 700,
    max: 1300,
    step: 50,
  },
  humidity: {
    colour: customColours.pink,
    displayName: 'Humidity',
    valueKey: 'humidity',
    unit: '%',
    min: 0,
    max: 100,
    step: 5,
  },
  airQuality: {
    colour: customColours.blue,
    displayName: 'Air Quality',
    description: 'Index of Air Quality (IAQ)',
    valueKey: 'airQuality',
    unit: '',
    min: 0,
    max: 500,
    step: 25,
  },
}

export const GREENHOUSE_METRICS: { [key: string]: GreenhouseMetricRange } = {
  ...NON_AIR_METRICS,
  ...AIR_METRICS,
}

export const greenhouseMetricWithUnit = (
  metricRange: GreenhouseMetricRange
): string =>
  metricRange.displayName +
  (metricRange.unit === '' ? '' : ` (${metricRange.unit})`)

export const emDash = '—'

/** FormData key for uploaded sensor station photos */
export const UPLOADED_PHOTO_KEY = 'multipartImage'

/** Title text to display on buttons for pairing with a new sensor station */
export const ADD_GREENHOUSE_TEXT = 'Add Greenhouse'

/** Helper text to display on buttons for pairing with a new sensor station */
export const ADD_GREENHOUSE_DESCRIPTION = 'Connect a new greenhouse'

/** Subtitle text for dialog to pair with a new sensor station */
export const ADD_GREENHOUSE_DIALOG_SUBTITLE =
  'Pair with a new sensor station via BLE to start monitoring your plants'

/** Constants for greenhouse view names, icons, and URLs. */
export const GREENHOUSE_VIEWS: {
  title: string
  key: SensorStationView
  Icon: React.FC<SvgIconTypeMap['props']>
  url: (sensorStationUuid: SensorStationUuid) => string
  loggedInOnly: boolean
}[] = [
  {
    title: 'Overview',
    key: SensorStationView.GRAPHICAL,
    Icon: DashboardIcon,
    url: (sensorStationUuid: SensorStationUuid) =>
      PAGE_URL.greenhouseView.href(
        sensorStationUuid,
        SensorStationView.GRAPHICAL
      ),
    loggedInOnly: true,
  },
  {
    title: 'Gallery',
    key: SensorStationView.GALLERY,
    Icon: GalleryIcon,
    url: (sensorStationUuid: SensorStationUuid) =>
      PAGE_URL.greenhouseView.href(
        sensorStationUuid,
        SensorStationView.GALLERY
      ),
    loggedInOnly: false,
  },
  {
    title: 'Table',
    key: SensorStationView.TABLE,
    Icon: StorageOutlinedIcon,
    url: (sensorStationUuid: SensorStationUuid) =>
      PAGE_URL.greenhouseView.href(sensorStationUuid, SensorStationView.TABLE),
    loggedInOnly: true,
  },
]
