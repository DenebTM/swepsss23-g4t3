import React from 'react'

import { SensorStationView } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { SensorStationUuid } from '~/models/sensorStation'

import { GreenhouseSegmentedButtons } from './GreenhouseSegmentedButtons'

interface GreenhouseViewHeaderProps {
  title: string
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
      left={<h3>{props.title}</h3>}
      right={<GreenhouseSegmentedButtons uuid={props.uuid} view={props.view} />}
    />
  )
}
