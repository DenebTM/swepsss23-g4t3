import React from 'react'

import { PageHeader } from '~/components/page/PageHeader'

import { GreenhouseSegmentedButtons } from './GreenhouseSegmentedButtons'

interface GreenhouseViewHeaderProps {
  title: string
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
      right={<GreenhouseSegmentedButtons />}
    />
  )
}
