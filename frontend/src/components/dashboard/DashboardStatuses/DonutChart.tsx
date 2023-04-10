import React, { useState } from 'react'
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { theme } from '~/styles/theme'

import { DonutFloatingLegend, DonutValue } from './DonutFloatingLegend'

interface DonutChartProps {
  data: DonutValue[]
  label: string
}

/**
 * Single donut chart showing the statuses and names of either access points or sensor stations.
 * Shows a floating legend component on segment hover.
 */
export const DonutChart: React.FC<DonutChartProps> = (props) => {
  const [legend, setLegend] = useState<
    { index: number; clientX: number; clientY: number } | undefined
  >()

  const onPieEnter = (data: any, index: number, e: React.MouseEvent) => {
    setLegend({
      index: index,
      clientX: e.clientX,
      clientY: e.clientY,
    })
  }
  const onPieLeave = () => {
    setLegend(undefined)
  }

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={props.data}
            innerRadius="82%"
            outerRadius="100%"
            dataKey="value"
            paddingAngle={3}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            onMouseOut={onPieLeave}
            startAngle={90}
            endAngle={-270}
          >
            {props.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                style={{
                  filter: `drop-shadow(2px 2px 2px ${theme.outlineVariant})`,
                  cursor: 'pointer',
                  transition: 'all 0.6s ease-in-out;',
                }}
                stroke="0"
              />
            ))}

            <Label
              width={100}
              position="center"
              fill={theme.outline}
              enableBackground={'green'}
            >
              {props.label}
            </Label>
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {legend && (
        <DonutFloatingLegend
          data={props.data[legend.index]}
          clientX={legend.clientX}
          clientY={legend.clientY}
        />
      )}
    </>
  )
}
