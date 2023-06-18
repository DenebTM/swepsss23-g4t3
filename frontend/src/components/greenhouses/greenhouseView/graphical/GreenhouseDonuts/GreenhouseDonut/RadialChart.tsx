import React from 'react'
import { PolarAngleAxis, RadialBar, RadialBarChart, Tooltip } from 'recharts'

import { alpha, useTheme } from '@mui/material/styles'

import { emDash, GreenhouseMetricRange, roundMetric } from '~/common'

import { normalisePercentage } from '../../GreenhouseGraph/helpers'

/** Use "Range" as the data key so that this is displayed as the row title in the recharts legend */
const DATA_KEY = 'Range'

interface ChartData {
  metricRange: GreenhouseMetricRange
  minThreshold: number
  maxThreshold: number
  value: number
}

interface RadialChartProps {
  data: ChartData[]
  /** Chart height in px */
  height: number
  /** Inner radius of the pie chart in percent */
  innerRadius?: string
  /** Chart width in px */
  width: number
}

/**
 * Radial chart component showing a single greenhouse metric
 */
export const RadialChart: React.FC<RadialChartProps> = (props) => {
  const theme = useTheme()

  const caculatePercentage = (d: ChartData): number => {
    const normalisedVal = normalisePercentage(
      d.value,
      d.metricRange.min,
      d.metricRange.max
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
      innerRadius={props.innerRadius ?? '86%'}
      outerRadius="100%"
      data={props.data.map((d: ChartData) => ({
        name: d.metricRange.displayName,
        [DATA_KEY]: caculatePercentage(d),
        fill: d.metricRange.colour,
      }))}
      startAngle={180 + 25}
      endAngle={0 - 25}
      barCategoryGap={2}
    >
      <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
      <RadialBar
        background={{
          fill: alpha(theme.outlineVariant, 0.25),
        }}
        dataKey={DATA_KEY}
      />

      <Tooltip
        wrapperStyle={{ zIndex: theme.zIndex.tooltip }}
        labelFormatter={(idx: number) => {
          const data = props.data[idx]
          return `${data.metricRange.displayName} : ${roundMetric(data.value)}${
            data.metricRange.unit
          }`
        }}
        formatter={(value: number | string, name, item, index): string => {
          const displayName = item.payload?.['name']
          const dataObj = props.data.find(
            (d: ChartData) => d.metricRange.displayName === displayName
          )
          if (typeof dataObj !== 'undefined') {
            const min = roundMetric(dataObj.minThreshold)
            const max = roundMetric(dataObj.maxThreshold)

            return `${min} ${emDash} ${max}${dataObj.metricRange.unit}`
          } else {
            return ''
          }
        }}
      />
    </RadialBarChart>
  )
}
