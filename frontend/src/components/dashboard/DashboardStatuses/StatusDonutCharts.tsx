import React from 'react'

import Grid from '@mui/material/Unstable_Grid2'

import { AccessPoint } from '~/models/accessPoint'
import { SensorStation, StationStatus } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { DonutChart } from './DonutChart'
import { DonutValue } from './DonutFloatingLegend'

/** Legend styles for an online entity */
const onlineStyles = {
  fill: theme.primary,
  legendFill: theme.primaryContainer,
  legendText: theme.onPrimaryContainer,
}

/** Legend styles for an offline entity */
const offlineStyles = {
  fill: theme.error,
  legendFill: theme.errorContainer,
  legendText: theme.onErrorContainer,
}

/** Legend styles for an entity in a warning state */
const warnStyles = {
  fill: theme.warn,
  legendFill: theme.warn,
  legendText: theme.onWarn,
}

/** Initial state of data to be displayed in a donut chart */
const initialEntityData = {
  entities: [],
  value: 0,
}

/** Text display value if an entity is online */
const ONLINE = 'online'

/** Text display value if an entity is offline */
const OFFLINE = 'offline'

/** Text display value if an entity is in a warning state */
const WARN = 'warning'

/** Empty state for access point donut chart */
const initialAccessPointData: DonutValue[] = [
  {
    displayName: ONLINE,
    ...initialEntityData,
    ...onlineStyles,
  },
  {
    displayName: OFFLINE,
    ...initialEntityData,
    ...offlineStyles,
  },
]

/** Empty state for sensor station donut chart */
const initialSensorStationData: DonutValue[] = [
  {
    displayName: ONLINE,
    ...initialEntityData,
    ...onlineStyles,
  },
  {
    displayName: WARN,
    ...initialEntityData,
    ...warnStyles,
  },
  {
    displayName: OFFLINE,
    ...initialEntityData,
    ...offlineStyles,
  },
]

interface StatusDonutChartsProps {
  accessPoints: AccessPoint[]
  sensorStations: SensorStation[]
}

/**
 * Donut chart showing the statuses of access points and sensor stations in the dashboard
 */
export const StatusDonutCharts: React.FC<StatusDonutChartsProps> = (props) => {
  /** Generate access point chart data to display */
  const accessPointData: DonutValue[] = props.accessPoints.reduce(
    (counts: DonutValue[], ap: AccessPoint) => {
      const status = ap.active ? ONLINE : OFFLINE
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
    initialAccessPointData
  )

  /**
   * Generate sensor station chart data to display.
   * qqjf TODO add additional possible status values
   */
  const sensorStationData: DonutValue[] = props.sensorStations.reduce(
    (counts: DonutValue[], ss: SensorStation) => {
      const status =
        ss.status === StationStatus.OFFLINE
          ? OFFLINE
          : ss.status === StationStatus.WARNING
          ? WARN
          : ONLINE
      return counts.map((c) =>
        c.displayName === status
          ? {
              ...c,
              entities: [`Greenhouse ${ss.uuid}`, ...c.entities],
              value: c.value + 1,
            }
          : c
      )
    },
    initialSensorStationData
  )

  return (
    <Grid container spacing={2} sx={{ width: '100%', height: 200 }}>
      <Grid xs={12} sm={6} sx={{ height: '100%' }}>
        <DonutChart data={accessPointData} label="Access Points" />
      </Grid>
      <Grid xs={12} sm={6} sx={{ height: 200 }}>
        <DonutChart data={sensorStationData} label="Greenhouses" />
      </Grid>
    </Grid>
  )
}
