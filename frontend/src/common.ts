import { SensorStationUuid } from './models/sensorStation'
import { UserRole } from './models/user'

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

/**
 * Paths for all frontend URLs.
 * Each value can have the following properties:
 *
 * @param href Value or function to generate the relative URL of the page
 * @param pageTitle The display title of the page
 * @param permittedRoles User roles allowed to view the page if these should be restricted.
 *
 */
export const URL = {
  /** Path for admin home */
  adminHome: {
    pageTitle: 'Admin Home',
    href: `/${ADMIN_ROOT}`,
    permittedRoles: [UserRole.ADMIN],
  },

  /** Path for admin to view all logs */
  adminLogs: {
    pageTitle: 'Logs',
    href: `/${ADMIN_ROOT}/logs`,
    permittedRoles: [UserRole.ADMIN],
  },

  /** Fallback error page */
  error: {
    pageTitle: 'Error',
    href: '/error',
  },

  /** Main dashboard page */
  dashboard: {
    pageTitle: 'Dashboard',
    href: '/',
  },

  /** Getting started instructions page */
  gettingStarted: {
    pageTitle: 'Getting Started',
    href: '/getting-started',
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
  },

  /** The login page */
  login: {
    pageTitle: 'Log In',
    href: '/login',
  },

  /** Path for access point managment by admins */
  manageAccessPoints: {
    pageTitle: 'Access Points',
    href: `/${ADMIN_ROOT}/access-points`,
    permittedRoles: [UserRole.ADMIN],
  },

  /** Path for sensor station managment by admins */
  manageGreenhouses: {
    pageTitle: 'Greenhouses',
    href: `/${ADMIN_ROOT}/${GREENHOUSES_ROOT}`,
    permittedRoles: [UserRole.ADMIN],
  },

  /** Path for user managment by admins */
  manageUsers: {
    pageTitle: 'Users',
    href: `/${ADMIN_ROOT}/users`,
    permittedRoles: [UserRole.ADMIN],
  },

  /** My greenhouses page showing sensor stations assigned to the logged-in user */
  myGreenhouses: {
    pageTitle: 'My Greenhouses',
    href: `/${GREENHOUSES_ROOT}`,
    permittedRoles: [UserRole.ADMIN, UserRole.GARDENER],
  },

  /**
   * Page for uploading photos for a single sensor station.
   * TODO qqjf encrypt the sensor station UUID for security
   * @param sensorStationId The UUID of the sensor station
   * @returns The relative path to the page
   */
  photoUpload: {
    pageTitle: 'Photo Upload',
    href: (sensorStationId: SensorStationUuid) =>
      `/${UPLOAD_ROOT}/${sensorStationId}`,
  },
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
