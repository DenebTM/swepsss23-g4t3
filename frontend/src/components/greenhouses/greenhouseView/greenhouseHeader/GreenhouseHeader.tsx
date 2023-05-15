import React from 'react'

import { Breadcrumbs } from '@component-lib/Breadcrumbs'
import { PAGE_URL, SensorStationView } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { isUserLoggedIn } from '~/helpers/jwt'
import { SensorStationUuid } from '~/models/sensorStation'

import { GreenhouseSegmentedButtons } from './GreenhouseSegmentedButtons'

interface GreenhouseViewHeaderProps {
  ssID: SensorStationUuid
  view: SensorStationView
}

/**
 * Header component for all variants of the greenhouse view.
 */
export const GreenhouseViewHeader: React.FC<GreenhouseViewHeaderProps> = (
  props
) => {
  return (
    <PageHeader
      left={
        <Breadcrumbs
          links={[
            {
              name: 'Dashboard',
              href: PAGE_URL.dashboard.href,
              disabled: !isUserLoggedIn(),
              tooltip: isUserLoggedIn() ? '' : 'Log in to view this page',
            },
          ]}
          currentPageName={PAGE_URL.greenhouseView.pageTitle(props.ssID)}
        />
      }
      right={<GreenhouseSegmentedButtons ssID={props.ssID} view={props.view} />}
    />
  )
}
