import React from 'react'

import { Breadcrumbs } from '@component-lib/Breadcrumbs'
import { PAGE_URL, SensorStationView } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { SensorStationUuid } from '~/models/sensorStation'

import { GreenhouseSegmentedButtons } from './GreenhouseSegmentedButtons'

interface GreenhouseViewHeaderProps {
  uuid: SensorStationUuid
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
          links={[{ name: 'Dashboard', href: PAGE_URL.dashboard.href }]}
          currentPageName={PAGE_URL.greenhouseView.pageTitle(props.uuid)}
        />
      }
      right={<GreenhouseSegmentedButtons uuid={props.uuid} view={props.view} />}
    />
  )
}
