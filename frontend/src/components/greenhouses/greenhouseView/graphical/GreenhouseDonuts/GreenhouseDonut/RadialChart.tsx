import React from 'react'
import { PolarAngleAxis, RadialBar, RadialBarChart, Tooltip } from 'recharts'

import { emDash, GreenhouseMetricRange, roundMetric } from '~/common'
import { theme } from '~/styles/theme'

import { normalisePercentage } from '../../GreenhouseGraph/helpers'

/** Use "Range" as the data key so that this is displayed as the row title in the recharts legend */
const DATA_KEY = 'Range'

interface RadialChartProps {
  /** Chart height in px */
  height: number
  metricRange: GreenhouseMetricRange
  value: number
  /** Chart width in px */
  width: number
}

/**
 * Radial chart component showing a single greenhouse metric
 */
export const RadialChart: React.FC<RadialChartProps> = (props) => {
  const caculatePercentage = (): number => {
    const normalisedVal = normalisePercentage(
      props.value,
      props.metricRange.min,
      props.metricRange.max
    )

    // Round to 2 deciomal places
    const roundedVal = Math.round((normalisedVal + Number.EPSILON) * 100) / 100

    // Restrict value to range [0,100] as greenhouse values might be out of bounds
    return Math.max(Math.min(roundedVal, 100), 0)
  }

  return (
    <RadialBarChart
      width={props.width}
      height={props.height}
      innerRadius="88%"
      outerRadius="100%"
      data={[
        {
          name: props.metricRange.displayName,
          [DATA_KEY]: caculatePercentage(),
          fill: props.metricRange.colour,
        },
      ]}
      startAngle={180 + 25}
      endAngle={0 - 25}
    >
      <PolarAngleAxis
        type="number"
        domain={[0, 100]}
        angleAxisId={props.metricRange.valueKey}
        tick={false}
      />
      <RadialBar
        background
        dataKey={DATA_KEY}
        angleAxisId={props.metricRange.valueKey}
      />
      <Tooltip
        wrapperStyle={{ zIndex: theme.zIndex.tooltip }}
        labelFormatter={(index: number) =>
          `${props.metricRange.displayName} : ${roundMetric(props.value)}${
            props.metricRange.unit
          }`
        }
        formatter={(value: number | string, name, payload, index) => {
          return `${props.metricRange.min} ${emDash} ${props.metricRange.max}${props.metricRange.unit}`
        }}
      />
    </RadialBarChart>
  )
}
