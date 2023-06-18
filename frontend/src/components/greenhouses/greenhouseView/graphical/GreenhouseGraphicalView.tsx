import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import Grid from '@mui/material/Unstable_Grid2'

import { DashboardCard } from '@component-lib/DashboardCard'
import { getSensorStationMeasurements } from '~/api/endpoints/sensorStations/measurements'
import { Message, MessageType } from '~/contexts/SnackbarContext/types'
import { useSensorStations } from '~/hooks/appContext'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { Measurement } from '~/models/measurement'
import { SensorStation, SensorStationUuid } from '~/models/sensorStation'

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

  const [sensorStation, setSensorStation] = useState<SensorStation | null>(null)
  const [measurements, setMeasurements] = useState<Measurement[]>()
  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /** Load measurements from the API on component mount */
  useEffect(() => {
    setMeasurements(undefined)
    const measurementPromise = cancelable(
      getSensorStationMeasurements(props.ssID)
    )
    loadMeasurements(measurementPromise)

    // Cancel the promise callbacks on component unmount
    return measurementPromise.cancel
  }, [props.ssID])

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
  }, [props.ssID, sensorStations])

  return (
    <Grid container spacing={2} padding={2}>
      <Grid xs={12}>
        <DashboardCard
          loading={
            typeof measurements === 'undefined' || sensorStation === null
          }
          empty={
            sensorStation !== null && sensorStation.currentMeasurement === null
          }
          emptyText={`The current measurements for greenhouse ${sensorStation?.ssID} will appear here.`}
        >
          {measurements && (
            <GreenhouseMetricDonuts
              measurement={
                sensorStation ? sensorStation.currentMeasurement : null
              }
              sensorStation={sensorStation}
            />
          )}
        </DashboardCard>
      </Grid>

      <Grid xs={12} sx={{ height: 400 }}>
        <DashboardCard
          loading={typeof measurements === 'undefined'}
          empty={measurements && measurements.length <= 1}
          emptyText="A graph of measurements from the last week will appear here once there are at least two measurements from this greenhouse."
        >
          {measurements && (
            <GreenhouseGraph
              measurements={measurements}
              sensorStation={sensorStation}
            />
          )}
        </DashboardCard>
      </Grid>
    </Grid>
  )
}
