import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'

import { AccessPoint } from '~/models/accessPoint'
import { SensorStation, StationStatus } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { DonutChart } from './DonutChart'
import { DonutValue } from './DonutFloatingLegend'

/** Initial state of data to be displayed in a donut chart */
const initialEntityData = {
  entities: [],
  value: 0,
}
/** Text display value if an entity is online */
const ONLINE = 'Online'

/** Text display value if an entity is offline */
const OFFLINE = 'Offline'

/** Text display value if an entity is in a warning state */
const WARN = 'Warning'

/** Initial values for an online entity */
const initialOnlineEntity = {
  displayName: ONLINE,
  fill: theme.primary,
  legendFill: theme.primaryContainer,
  legendText: theme.onPrimaryContainer,
  ...initialEntityData,
}

/** Initial values for an entity in a warning state */
const initialWarnEntity = {
  displayName: WARN,
  fill: theme.warn,
  legendFill: theme.warnContainer,
  legendText: theme.onWarnContainer,
  ...initialEntityData,
}

/** Initial values for an online entity */
const initialOfflineEntity = {
  displayName: OFFLINE,
  fill: theme.error,
  legendFill: theme.errorContainer,
  legendText: theme.onErrorContainer,
  ...initialEntityData,
}

/** Empty state for access point donut chart */
const initialAccessPointData: DonutValue[] = [
  initialOnlineEntity,
  initialOfflineEntity,
]

/** Empty state for sensor station donut chart */
const initialSensorStationData: DonutValue[] = [
  initialOnlineEntity,
  initialWarnEntity,
  initialOfflineEntity,
]

interface StatusDonutChartsProps {
  accessPoints: AccessPoint[]
  sensorStations: SensorStation[]
}

/**
 * Donut charts showing the statuses of access points and sensor stations in the dashboard
 */
export const StatusDonutCharts: React.FC<StatusDonutChartsProps> = (props) => {
  const stackDonuts = useMediaQuery(theme.breakpoints.down('sm'))
  const donutHeight = stackDonuts ? 150 : 200

  /** Generate access point chart data to display */
  const accessPointData: DonutValue[] = props.accessPoints.reduce(
    (counts: DonutValue[], ap: AccessPoint) => {
      const status = ap.active ? ONLINE : OFFLINE
      return counts.map((c) =>
        c.displayName === status
          ? {
              ...c,
              entities: [ap.apName, ...c.entities],
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
      let status: string

      switch (ss.status) {
        case StationStatus.OFFLINE:
          status = OFFLINE
          break

        case StationStatus.WARNING:
          status = WARN
          break

        default:
          status = ONLINE
          break
      }

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
    <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={1} sx={{ width: '100%', height: '100%' }}>
        <Grid xs={12} sm={6} md={6} height={donutHeight}>
          <DonutChart data={accessPointData} label="Access Points" />
        </Grid>
        <Grid xs={12} sm={6} md={6} height={donutHeight}>
          <DonutChart data={sensorStationData} label={'Greenhouses'} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {initialSensorStationData.map((v) => (
          <Grid
            xs={12}
            sm={4}
            key={v.displayName}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component="span"
              sx={{
                background: v.fill,
                minHeight: theme.spacing(1.5),
                minWidth: theme.spacing(1.5),
                borderRadius: 99,
                marginRight: 1,
                boxShadow: theme.shadows[1],
              }}
            />
            <Typography
              variant="labelMedium"
              color={theme.outline}
              width={stackDonuts ? theme.spacing(8) : undefined}
            >
              {v.displayName}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
