import React from 'react'

import Dialog from '@mui/material/Dialog'
import { useTheme } from '@mui/material/styles'

import { DialogHeader } from '@component-lib/DialogHeader'
import { ADD_GREENHOUSE_DIALOG_SUBTITLE, ADD_GREENHOUSE_TEXT } from '~/common'
import { AccessPoint, AccessPointId } from '~/models/accessPoint'

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
  const theme = useTheme()

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
        subtitle={ADD_GREENHOUSE_DIALOG_SUBTITLE}
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
