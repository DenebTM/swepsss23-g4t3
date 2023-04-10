import React from 'react'

import Grid from '@mui/material/Unstable_Grid2'

import { AccessPoint } from '~/models/accessPoint'
import { SensorStation } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { DonutChart } from './DonutChart'
import { DonutValue } from './DonutFloatingLegend'

interface StatusDonutChartsProps {
  accessPoints: AccessPoint[]
  sensorStations: SensorStation[]
}

/**
 * Donut chart showing the statuses of access points and sensor stations in the dashboard
 */
export const StatusDonutCharts: React.FC<StatusDonutChartsProps> = (props) => {
  return (
    <Grid container spacing={2} sx={{ width: '100%', height: 200 }}>
      <Grid xs={12} sm={6} sx={{ height: '100%' }}>
        test
      </Grid>
      <Grid xs={12} sm={6} sx={{ height: 200 }}>
        <DonutChart
          data={props.accessPoints.reduce(
            (counts: DonutValue[], ap: AccessPoint) => {
              const status = ap.active ? 'online' : 'offline'
              return counts.map((c) =>
                c.displayName === status
                  ? {
                      ...c,
                      entities: [ap.name, ...c.entities],
                      value: c.value + 1,
                    }
                  : c
              )
            },
            [
              {
                displayName: 'online',
                entities: [],
                fill: theme.primary,
                legendFill: theme.primaryContainer,
                legendText: theme.onPrimaryContainer,
                value: 0,
              },
              {
                displayName: 'offline',
                entities: [],
                legendFill: theme.errorContainer,
                legendText: theme.onErrorContainer,
                fill: theme.error,
                value: 0,
              },
            ]
          )}
        />
      </Grid>
    </Grid>
  )
}
