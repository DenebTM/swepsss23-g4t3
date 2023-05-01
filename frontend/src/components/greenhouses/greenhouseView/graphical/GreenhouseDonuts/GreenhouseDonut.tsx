import React from 'react'

import { GreenhouseMetricRange } from '~/common'

interface GreenhouseDonutProps {
  donutHeight: number
  metricRange: GreenhouseMetricRange
  value: number
}

/**
 * Donuts chart showing a single greenhouse metric
 */
export const GreenhouseDonut: React.FC<GreenhouseDonutProps> = (props) => {
  return <div>Donut {props.metricRange.displayName}</div>
}
