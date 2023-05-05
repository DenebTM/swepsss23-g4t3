import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import Grid from '@mui/material/Unstable_Grid2'

import { DashboardCard } from '@component-lib/DashboardCard'
import dayjs from 'dayjs'
import { getSensorStationMeasurements } from '~/api/endpoints/sensorStations/measurements'
import { Message, MessageType } from '~/contexts/SnackbarContext/types'
import { useSensorStations } from '~/hooks/appContext'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { Measurement } from '~/models/measurement'
import { SensorStationUuid } from '~/models/sensorStation'

import { GreenhouseAirMetrics } from './GreenhouseAirMetrics'
import { GreenhouseDonuts } from './GreenhouseDonuts'
import { GreenhouseGraph } from './GreenhouseGraph/GreenhouseGraph'

interface GreenhouseGraphicalViewProps {
  uuid: SensorStationUuid
}

/**
 * Page showing a graphical display of information for a single sensor station
 */
export const GreenhouseGraphicalView: React.FC<GreenhouseGraphicalViewProps> = (
  props
) => {
  const sensorStations = useSensorStations()
  const addSnackbarMessage = useAddSnackbarMessage()
  const [measurements, setMeasurements] = useState<Measurement[]>()
  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /** Load measurements from the API on component mount */
  useEffect(() => {
    const measurementPromise = cancelable(
      getSensorStationMeasurements(
        props.uuid,
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

  return (
    <Grid container spacing={2} padding={2}>
      {measurements && ( // qqjf TODO add a loading state to each card
        <>
          <Grid xs={12} md={8}>
            <DashboardCard>
              <GreenhouseDonuts
                measurement={measurements.length > 0 ? measurements[0] : null}
                uuid={props.uuid}
              />
            </DashboardCard>
          </Grid>
          <Grid xs={12} md={4}>
            <DashboardCard>
              <GreenhouseAirMetrics
                measurement={measurements.length > 0 ? measurements[0] : null}
                uuid={props.uuid}
              />
            </DashboardCard>
          </Grid>
          <Grid xs={12}>
            <DashboardCard>
              <GreenhouseGraph
                measurements={measurements}
                sensorStation={sensorStations?.find(
                  (s) => s.uuid === props.uuid
                )}
                uuid={props.uuid}
              />
            </DashboardCard>
          </Grid>
        </>
      )}
    </Grid>
  )
}
