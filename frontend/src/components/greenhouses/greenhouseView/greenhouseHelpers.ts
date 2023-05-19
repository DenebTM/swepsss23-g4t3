import { Params } from 'react-router-dom'

import {
  GREENHOUSE_VIEW_QUERY,
  SensorStationView,
  SS_UUID_PARAM,
} from '~/common'
import { SensorStationUuid } from '~/models/sensorStation'

/**
 * @param params The router params for the current greenhouse page
 * @returns The sensor station id for the current greenhouse page
 */
export const getSsUuidFromParams = (
  params: Readonly<Params<string>>
): SensorStationUuid | undefined => {
  if (typeof params[SS_UUID_PARAM] !== 'undefined') {
    return Number(params[SS_UUID_PARAM])
  }
}

/**
 * @param search The URL search params for the current greenhouse page
 * @returns The greenhouse view
 */
export const getViewFromSearchParams = (
  search: URLSearchParams
): SensorStationView => {
  const sensorStationView = search.get(GREENHOUSE_VIEW_QUERY)
  switch (sensorStationView) {
    case SensorStationView.GALLERY:
    case SensorStationView.TABLE:
      return sensorStationView
    default: // Cover null, empty string, and invalid values
      return SensorStationView.GRAPHICAL
  }
}
