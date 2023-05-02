import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

import { DialogHeader } from '@component-lib/DialogHeader'
import { AccessPointId } from '~/models/accessPoint'
import { theme } from '~/styles/theme'

const dialogTitleId = 'add-sensorstation-dialog-title'

interface AddSensorStationModalProps {
  accessPointId?: AccessPointId
  onClose: () => void
  open: boolean
}

/**
 * Modal to add a new sensor station to a given greenhouse.
 */
export const AddSensorStationModal: React.FC<AddSensorStationModalProps> = (
  props
): JSX.Element => {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby={dialogTitleId}
      PaperProps={{
        sx: { minWidth: '70%', padding: theme.spacing(1, 3, 2) },
      }}
    >
      <DialogHeader
        handleClose={props.onClose}
        subtitle="Pair with a new sensor station below"
        titleId={dialogTitleId}
        title="Add Greenhouse"
      />
      <DialogContent sx={{ textAlign: 'center' }}>
        to add: dialog contents
      </DialogContent>
    </Dialog>
  )
}
