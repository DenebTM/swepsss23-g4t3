import React, { useState } from 'react'

import DialogContent from '@mui/material/DialogContent'

import { AccessPointId } from '~/models/accessPoint'

import { AccessPointSelect } from './SsDialogRow/AccessPointSelect'
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
  const [accessPoint, setAccessPoint] = useState<AccessPointId | undefined>(
    props.accessPointId
  )

  return (
    <DialogContent sx={{ textAlign: 'center' }}>
      <SsDialogRow
        row={1}
        description="Select which access point the greenhouse should connect to. If your access point does not appear here then you might need to connect a new access point."
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
        scan button
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
