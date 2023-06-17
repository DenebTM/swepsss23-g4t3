import React from 'react'

import Dialog from '@mui/material/Dialog'

import { DialogHeader } from '@component-lib/DialogHeader'
import { ADD_GREENHOUSE_TEXT } from '~/common'
import { AccessPoint, AccessPointId } from '~/models/accessPoint'
import { theme } from '~/styles/theme'

import { AddSsDialogContents } from './AddSsDialogContents'

const dialogTitleId = 'add-sensorstation-dialog-title'

interface AddSensorStationDialogProps {
  accessPointId?: AccessPointId
  onClose: () => void
  open: boolean
  updateApInState?: (updatedAp: AccessPoint) => void
}

/**
 * Dialog to add a new sensor station to a given greenhouse.
 */
export const AddSensorStationDialog: React.FC<AddSensorStationDialogProps> = (
  props
): JSX.Element => {
  return (
    <Dialog
      open={props.open}
      onClose={() => props.onClose()}
      aria-labelledby={dialogTitleId}
      PaperProps={{
        sx: {
          padding: theme.spacing(1, 3, 2),
          width: '70%',
          maxWidth: '800px',
        },
      }}
    >
      <DialogHeader
        handleClose={props.onClose}
        subtitle="Pair with a new sensor station via BLE to start monitoring your plants"
        titleId={dialogTitleId}
        title={ADD_GREENHOUSE_TEXT}
      />
      <AddSsDialogContents
        accessPointId={props.accessPointId}
        closeDialog={props.onClose}
        updateApInState={props.updateApInState}
      />
    </Dialog>
  )
}
