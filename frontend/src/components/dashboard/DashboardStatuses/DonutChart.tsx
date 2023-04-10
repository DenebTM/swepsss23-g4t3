import React, { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import Box from '@mui/material/Box'

import { DonutFloatingLegend, DonutValue } from './DonutFloatingLegend'

interface DonutChartProps {
  data: DonutValue[]
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
    <Box sx={{ position: 'relative', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={props.data}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            paddingAngle={4}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            startAngle={90}
            endAngle={-270}
            style={{ cursor: 'pointer' }}
          >
            {props.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
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
    </Box>
  )
}
