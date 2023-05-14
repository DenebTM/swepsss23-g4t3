import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import Grid from '@mui/material/Unstable_Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'

import { DashboardCard } from '@component-lib/DashboardCard'
import dayjs from 'dayjs'
import { getSensorStationMeasurements } from '~/api/endpoints/sensorStations/measurements'
import { Message, MessageType } from '~/contexts/SnackbarContext/types'
import { useSensorStations } from '~/hooks/appContext'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { Measurement } from '~/models/measurement'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { GreenhouseAirMetrics } from './GreenhouseDonuts/GreenhouseAirMetrics'
import { GreenhouseMetricDonuts } from './GreenhouseDonuts/GreenhouseMetricDonuts'
import { GreenhouseGraph } from './GreenhouseGraph/GreenhouseGraph'

interface GreenhouseGraphicalViewProps {
  ssID: SensorStationUuid
}

/**
 * Page showing a graphical display of information for a single sensor station
 */
export const GreenhouseGraphicalView: React.FC<GreenhouseGraphicalViewProps> = (
  props
) => {
  const sensorStations = useSensorStations()
  const addSnackbarMessage = useAddSnackbarMessage()
  const breakMd = useMediaQuery(theme.breakpoints.down('md'))

  /** Donut height in px. qqjf TODO make this responsive  */
  const donutHeight = breakMd ? 250 : 175

  const [sensorStation, setSensorStation] = useState<SensorStation | null>(null)
  const [measurements, setMeasurements] = useState<Measurement[]>()
  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /** Load measurements from the API on component mount */
  useEffect(() => {
    const measurementPromise = cancelable(
      getSensorStationMeasurements(
        props.ssID,
        dayjs().subtract(1, 'week').toISOString(),
        dayjs().toISOString()
      )
    )
    loadMeasurements(measurementPromise)

    // Cancel the promise callbacks on component unmount
    return measurementPromise.cancel
  }, [])

  /** Create a new snackbar if {@link snackbarMessage} has been updated */
  useEffect(() => {
    if (snackbarMessage !== null) {
      addSnackbarMessage(snackbarMessage)
    }
  }, [addSnackbarMessage, snackbarMessage])

  /** Load sensor station measurements from the backend and set in state */
  const loadMeasurements = (promise: Promise<Measurement[]>) =>
    promise
      .then((data) => {
        setMeasurements(data)
      })
      .catch((err: Error) => {
        setSnackbarMessage({
          header: 'Could not load measurements',
          body: err.message,
          type: MessageType.ERROR,
        })
        setMeasurements([]) // Remove loading state
      })

  /** Set the sensor station object in state when sensorStations are updated */
  useEffect(() => {
    const foundSs = sensorStations
      ? sensorStations.find((s) => s.ssID === props.ssID)
      : null
    setSensorStation(foundSs ?? null)
  }, [sensorStations])

  return (
    <Grid container spacing={2} padding={2}>
      {measurements && ( // qqjf TODO add a loading state to each card
        <>
          <Grid xs={12} md={8}>
            <DashboardCard>
              <GreenhouseMetricDonuts
                donutHeight={donutHeight}
                measurement={measurements.length > 0 ? measurements[0] : null}
                sensorStation={sensorStation}
              />
            </DashboardCard>
          </Grid>
          <Grid xs={12} md={4}>
            <DashboardCard>
              <GreenhouseAirMetrics
                donutHeight={donutHeight}
                measurement={measurements.length > 0 ? measurements[0] : null}
                sensorStation={sensorStation}
              />
            </DashboardCard>
          </Grid>
          <Grid xs={12}>
            <DashboardCard>
              <GreenhouseGraph
                measurements={measurements}
                sensorStation={sensorStation}
              />
            </DashboardCard>
          </Grid>
        </>
      )}
    </Grid>
  )
}
