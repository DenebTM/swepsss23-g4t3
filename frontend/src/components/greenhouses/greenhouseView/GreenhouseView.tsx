import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { SensorStationView, SS_UUID_PARAM } from '~/common'
import { PageWrapper } from '~/components/page/PageWrapper'
import { SensorStationUuid } from '~/models/sensorStation'

import { GreenhouseGallery } from './gallery/GreenhouseGallery'
import { GreenhouseGraphicalView } from './graphical/GreenhouseGraphicalView'
import { GreenhouseViewHeader } from './greenhouseHeader/GreenhouseHeader'
import {
  getSsUuidFromParams,
  getViewFromSearchParams,
} from './greenhouseHelpers'
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
    setUuid(getSsUuidFromParams(params))
  }, [params[SS_UUID_PARAM]])

  /** Get page view from seach (query) params */
  useEffect(() => {
    setView(getViewFromSearchParams(search))
  }, [search])

  return (
    <PageWrapper>
      {
        typeof uuid !== 'undefined' && typeof view !== 'undefined' && (
          <>
            <GreenhouseViewHeader
              title={'Greenhouse ' + uuid}
              uuid={uuid}
              view={view}
            />
            {(() => {
              switch (view) {
                case SensorStationView.GALLERY:
                  return <GreenhouseGallery uuid={uuid} />
                case SensorStationView.TABLE:
                  return <GreenhouseTabularView uuid={uuid} />
                default:
                  return <GreenhouseGraphicalView uuid={uuid} />
              }
            })()}
          </>
        )
        // TODO qqjf add error handling if uuid or view are invalid
      }
    </PageWrapper>
  )
}
