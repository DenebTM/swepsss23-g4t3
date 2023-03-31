import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  GREENHOUSE_VIEW_QUERY,
  SensorStationView,
  SS_UUID_PARAM,
} from '~/common'
import { PageWrapper } from '~/components/page/PageWrapper'
import { SensorStationUuid } from '~/models/sensorStation'

import { GreenhouseGallery } from './gallery/GreenhouseGallery'
import { GreenhouseGraphicalView } from './graphical/GreenhouseGraphicalView'
import { GreenhouseTabularView } from './tabular/GreenhouseTabularView'

/**
 * Page to view contents relating to a single sensor station.
 * Supports viewing a tabular, graphical, or gallery view of the given sensor station.
 */
export const GreenhouseView: React.FC = () => {
  const [uuid, setUuid] = useState<SensorStationUuid>()
  const [view, setView] = useState<SensorStationView>()
  const params = useParams()
  const [search] = useSearchParams()

  /** Get sensor station UUID from URL params */
  useEffect(() => {
    if (typeof params[SS_UUID_PARAM] !== 'undefined') {
      setUuid(Number(params[SS_UUID_PARAM]))
    }
  }, [params[SS_UUID_PARAM]])

  /** Get page view from seach (query) params */
  useEffect(() => {
    switch (search.get(GREENHOUSE_VIEW_QUERY)) {
      case SensorStationView.GALLERY:
        setView(SensorStationView.GALLERY)
        break
      case SensorStationView.TABLE:
        setView(SensorStationView.TABLE)
        break
      default: // Cover null case
        setView(SensorStationView.GRAPHICAL)
    }
  }, [search])

  return (
    <PageWrapper>
      Greenhouse view for greenhouse {uuid} {view && 'with view  ' + view}
      {typeof uuid !== 'undefined' &&
        typeof view !== 'undefined' &&
        (() => {
          switch (view) {
            case SensorStationView.GALLERY:
              return <GreenhouseGallery uuid={uuid} />
            case SensorStationView.TABLE:
              return <GreenhouseTabularView uuid={uuid} />
            default:
              return <GreenhouseGraphicalView uuid={uuid} />
          }
        })()}
    </PageWrapper>
  )
}
