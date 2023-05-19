import React, { useState } from 'react'
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from 'recharts'

import Typography from '@mui/material/Typography'

import { theme } from '~/styles/theme'

import { DonutFloatingLegend, DonutValue } from './DonutFloatingLegend'

interface DonutChartProps {
  /** If `props.data` is `null` then an empty state will be displayed */
  data: DonutValue[] | null
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

  return props.data === null ? (
    <Typography
      variant="bodySmall"
      color="onSurfaceVariant"
      align="center"
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1, 2),
      }}
    >
      Statuses for {props.label.toLowerCase()} will be displayed here.
    </Typography>
  ) : (
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
                key={`${props.label}-cell-${index}`}
                fill={entry.fill}
                style={{
                  filter: `drop-shadow(2px 2px 2px ${theme.outlineVariant})`,
                  cursor: 'pointer',
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
