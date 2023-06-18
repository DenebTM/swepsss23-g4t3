import React, { useEffect, useState } from 'react'

import DialogContent from '@mui/material/DialogContent'

import { Spinner } from '@component-lib/Spinner'
import { getAccessPoint, updateAccessPoint } from '~/api/endpoints/accessPoints'
import { useLoadSensorStations } from '~/hooks/appContext'
import { useAddErrorSnackbar } from '~/hooks/snackbar'
import { AccessPoint, AccessPointId, ApStatus } from '~/models/accessPoint'
import { SensorStationUuid } from '~/models/sensorStation'

import { AccessPointSelect } from './SsDialogRow/AccessPointSelect'
import { ConfirmPairingButton } from './SsDialogRow/ConfirmPairingButton'
import { SensorStationSelect } from './SsDialogRow/SensorStationSelect'
import { SsDialogRow } from './SsDialogRow/SsDialogRow'

interface AddSsDialogContentsProps {
  accessPointId?: AccessPointId
  closeDialog: () => void
  updateApInState?: (updatedAp: AccessPoint) => void
}

/**
 * Contents of dialog to add a new sensor station to a given greenhouse.
 */
export const AddSsDialogContents: React.FC<AddSsDialogContentsProps> = (
  props
): JSX.Element => {
  const addErrorSnackbar = useAddErrorSnackbar()
  const loadSensorStations = useLoadSensorStations()

  const [accessPoint, setAccessPoint] = useState<AccessPoint | undefined>()
  const [sensorStationId, setSensorStationId] = useState<
    SensorStationUuid | undefined
  >()

  /** Manage accessPoint SEARCHING status */
  useEffect(() => {
    if (typeof accessPoint !== 'undefined') {
      // Set access point to SEARCHING when it is selected
      updateAccessPointStatus(ApStatus.SEARCHING, accessPoint)
    }

    return () => {
      // When component is unmounted or `accessPoint` is changed, reset access point to not be SEARCHING
      updateAccessPointStatus(ApStatus.ONLINE, accessPoint)
    }
  }, [accessPoint?.name])

  const updateAccessPointStatus = (
    newStatus: ApStatus,
    currentAccessPoint?: AccessPoint
  ) => {
    if (typeof currentAccessPoint !== 'undefined') {
      updateAccessPoint(currentAccessPoint.name, { status: newStatus })
        .then((updatedAp) => {
          props.updateApInState?.(updatedAp)
        })
        .catch((err: Error) => {
          addErrorSnackbar(err, 'Unable to update access point status')
        })
    }
  }

  /** Manage reloading sensor stations and access points periodically */
  useEffect(() => {
    // Reload access point periodically
    const apLoadInterval = setInterval(() => {
      // Access point to load (defaults to the currently selected access point)
      const apName: AccessPointId | undefined =
        typeof accessPoint !== 'undefined'
          ? accessPoint.name
          : props.accessPointId

      if (typeof apName !== 'undefined') {
        loadSensorStations()
        getAccessPoint(apName)
          .then((ap) => setAccessPoint(ap))
          .catch((err: Error) => {
            addErrorSnackbar(err, 'Unable to reload access point')
          })
      }
    }, 2000)

    return () => clearInterval(apLoadInterval)
  }, [accessPoint, loadSensorStations, props.accessPointId])

  return (
    <DialogContent sx={{ textAlign: 'center' }}>
      <SsDialogRow
        row={1}
        description="Select which access point the greenhouse should connect to. If your access point does not appear here, then check that it is connected and online."
        title="Select Access Point"
      >
        {typeof props.accessPointId === 'undefined' || accessPoint ? (
          <AccessPointSelect
            accessPoint={accessPoint}
            setAccessPoint={setAccessPoint}
          />
        ) : (
          <Spinner />
        )}
      </SsDialogRow>

      <SsDialogRow
        row={2}
        description="Press the button on the sensor station to turn on Bluetooth. The sensor station will be automatically detected."
        title="Activate Sensor Station"
      >
        <SensorStationSelect
          accessPoint={accessPoint}
          sensorStationId={sensorStationId}
          setSensorStationId={setSensorStationId}
        />
      </SsDialogRow>
      <SsDialogRow
        row={3}
        description="When you're happy, click confirm to add the sensor station."
        title="Confirm"
      >
        <ConfirmPairingButton
          closeDialog={props.closeDialog}
          sensorStationId={sensorStationId}
        />
      </SsDialogRow>
    </DialogContent>
  )
}
