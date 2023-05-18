import React, { useEffect, useRef, useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useWindowSize } from '~/hooks/windowSize'
import { AccessPoint, ApStatus } from '~/models/accessPoint'
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

/** Text display value if an entity is in the process of being ipdated */
const UPDATING = 'Updating'

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

/** Initial values for an updating entity */
const initialUpdatingEntity = {
  displayName: UPDATING,
  fill: theme.tertiary,
  legendFill: theme.tertiaryContainer,
  legendText: theme.onTertiaryContainer,
  ...initialEntityData,
}

/** Empty state for access point donut chart */
const initialAccessPointData: DonutValue[] = [
  initialOnlineEntity,
  initialUpdatingEntity,
  initialOfflineEntity,
]

/** Empty state for sensor station donut chart */
const initialSensorStationData: DonutValue[] = [
  initialOnlineEntity,
  initialUpdatingEntity,
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
  const stackDonuts = useMediaQuery(theme.breakpoints.down('lg'))

  const donutContainerRef = useRef<HTMLDivElement>(null)
  const windowSize = useWindowSize()
  const [donutHeight, setDonutHeight] = useState(150)

  useEffect(() => {
    if (donutContainerRef.current) {
      const containerWidth = donutContainerRef.current.clientWidth
      console.log(stackDonuts)
      const calculatedDonutHeight = stackDonuts
        ? containerWidth
        : Math.floor(containerWidth / 2)
      setDonutHeight(Math.min(calculatedDonutHeight, 200))
    }
  }, [donutContainerRef, windowSize])

  /** Generate access point chart data to display */
  const accessPointData: DonutValue[] | null =
    props.accessPoints.length > 0
      ? props.accessPoints.reduce((counts: DonutValue[], ap: AccessPoint) => {
          let status: string

          switch (ap.status) {
            case ApStatus.OFFLINE:
              status = OFFLINE
              break

            case ApStatus.UNCONFIRMED:
              status = WARN
              break

            case ApStatus.SEARCHING:
              status = UPDATING
              break

            default:
              status = ONLINE
              break
          }

          return counts.map((c) =>
            c.displayName === status
              ? {
                  ...c,
                  entities: [ap.name, ...c.entities],
                  value: c.value + 1,
                }
              : c
          )
        }, initialAccessPointData)
      : null

  /**
   * Generate sensor station chart data to display.
   */
  const sensorStationData: DonutValue[] | null =
    props.sensorStations.length > 0
      ? props.sensorStations.reduce(
          (counts: DonutValue[], ss: SensorStation) => {
            let status: string

            switch (ss.status) {
              case StationStatus.OFFLINE:
              case StationStatus.PAIRING_FAILED:
                status = OFFLINE
                break

              case StationStatus.WARNING:
                status = WARN
                break

              case StationStatus.PAIRING:
              case StationStatus.AVAILABLE:
                status = UPDATING
                break

              case StationStatus.OK:
              default:
                status = ONLINE
                break
            }

            return counts.map((c) =>
              c.displayName === status
                ? {
                    ...c,
                    entities: [`Greenhouse ${ss.ssID}`, ...c.entities],
                    value: c.value + 1,
                  }
                : c
            )
          },
          initialSensorStationData
        )
      : null

  return (
    <Box
      component="div"
      sx={{
        padding: theme.spacing(2, 2),
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid
        container
        spacing={1}
        alignContent="center"
        sx={{ width: '100%', height: '100%' }}
        ref={donutContainerRef}
      >
        <Grid xs={12} lg={6} height={donutHeight}>
          <DonutChart data={accessPointData} label="Access Points" />
        </Grid>
        <Grid xs={12} lg={6} height={donutHeight} marginBottom={2}>
          <DonutChart data={sensorStationData} label={'Greenhouses'} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {initialSensorStationData.map((v) => (
          <Grid
            xs={12}
            sm={3}
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
