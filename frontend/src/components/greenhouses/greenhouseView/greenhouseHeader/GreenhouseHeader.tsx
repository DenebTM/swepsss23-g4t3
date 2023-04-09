import React from 'react'

import { Breadcrumbs } from '@component-lib/Breadcrumbs'
import { SensorStationView, URL } from '~/common'
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
          links={[{ name: 'Dashboard', href: URL.dashboard }]}
          currentPageName={`Greenhouse ${props.uuid}`}
        />
      }
      right={<GreenhouseSegmentedButtons uuid={props.uuid} view={props.view} />}
    />
  )
}
