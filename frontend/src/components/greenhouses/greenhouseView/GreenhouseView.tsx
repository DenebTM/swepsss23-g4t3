import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { Spinner } from '@component-lib/Spinner'
import { PAGE_URL, SensorStationView } from '~/common'
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
  const [ssID, setUuid] = useState<SensorStationUuid>()
  const [view, setView] = useState<SensorStationView>()
  const params = useParams()
  const [search] = useSearchParams()

  /** Get sensor station UUID from URL params */
  useEffect(() => {
    setUuid(getSsUuidFromParams(params))
  }, [params])

  /** Get page view from seach (query) params */
  useEffect(() => {
    setView(getViewFromSearchParams(search))
  }, [search])

  return (
    <PageWrapper permittedRoles={PAGE_URL.greenhouseView.permittedRoles(view)}>
      {typeof ssID !== 'undefined' && typeof view !== 'undefined' ? (
        <>
          <GreenhouseViewHeader view={view} ssID={ssID} />
          {(() => {
            switch (view) {
              case SensorStationView.GALLERY:
                return <GreenhouseGallery ssID={ssID} />
              case SensorStationView.TABLE:
                return <GreenhouseTabularView ssID={ssID} />
              default:
                return <GreenhouseGraphicalView ssID={ssID} />
            }
          })()}
        </>
      ) : (
        <Spinner center />
      )}
    </PageWrapper>
  )
}
