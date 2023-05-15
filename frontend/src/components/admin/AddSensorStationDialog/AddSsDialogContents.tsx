import React, { useEffect, useState } from 'react'

import DialogContent from '@mui/material/DialogContent'

import { getAccessPoint, updateAccessPoint } from '~/api/endpoints/accessPoints'
import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { AccessPoint, AccessPointId, ApStatus } from '~/models/accessPoint'
import { SensorStationUuid } from '~/models/sensorStation'

import { AccessPointSelect } from './SsDialogRow/AccessPointSelect'
import { SensorStationSelect } from './SsDialogRow/SensorStationSelect'
import { SsDialogRow } from './SsDialogRow/SsDialogRow'

interface AddSsDialogContentsProps {
  accessPointId?: AccessPointId
}

/**
 * Contents of dialog to add a new sensor station to a given greenhouse.
 */
export const AddSsDialogContents: React.FC<AddSsDialogContentsProps> = (
  props
): JSX.Element => {
  const addSnackbarMessage = useAddSnackbarMessage()
  const [accessPoint, setAccessPoint] = useState<AccessPoint | undefined>()
  const [sensorStationId, setSensorStationId] = useState<
    SensorStationUuid | undefined
  >()

  /** Manage accessPoint SEARCHING status */
  useEffect(() => {
    if (typeof accessPoint !== 'undefined') {
      // Set access point to SEARCHING when it is selected
      updateAccessPoint(accessPoint.name, { status: ApStatus.SEARCHING })
    }

    return () => {
      // When component is unmounted or `accessPoint` is changed, reset access point to not be SEARCHING
      if (typeof accessPoint !== 'undefined') {
        updateAccessPoint(accessPoint.name, { status: ApStatus.ONLINE })
      }
    }
  }, [accessPoint])

  /** Reload access point periodically */
  useEffect(() => {
    const apLoadInterval = setInterval(() => {
      if (typeof accessPoint !== 'undefined') {
        getAccessPoint(accessPoint.name)
          .then((ap) => setAccessPoint(ap))
          .catch((err: Error) => {
            addSnackbarMessage({
              header: 'Unable to reload access point',
              body: err.message,
              type: MessageType.ERROR,
            })
          })
      }
    }, 2000)
    return clearInterval(apLoadInterval)
  }, [])

  return (
    <DialogContent sx={{ textAlign: 'center' }}>
      <SsDialogRow
        row={1}
        description="Select which access point the greenhouse should connect to. If your access point does not appear here then check that it is connected and reachable."
        title="Select Access Point"
      >
        <AccessPointSelect
          accessPoint={accessPoint}
          setAccessPoint={setAccessPoint}
        />
      </SsDialogRow>

      <SsDialogRow
        row={2}
        description='Press the button on the sensor station to turn on Bluetooth then click "Start Scan". The sensor station will be automatically detected.'
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
        description="When you’re happy, click confirm to add the sensor station."
        title="Confirm"
      >
        confirm
      </SsDialogRow>
    </DialogContent>
  )
}
