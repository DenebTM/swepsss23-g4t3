import { SensorStationUuid } from './models/sensorStation'

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
   * qqjf to do: encrypt the sensor station UUID for security
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
