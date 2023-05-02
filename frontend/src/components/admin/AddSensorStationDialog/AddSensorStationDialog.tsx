import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

import { AccessPointId } from '~/models/accessPoint'
import { theme } from '~/styles/theme'

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
      aria-labelledby="add-sensorstation-dialog-title"
      PaperProps={{
        sx: { minWidth: '70%', padding: theme.spacing(1, 3, 2) },
      }}
    >
      HEADER
      <DialogContent sx={{ textAlign: 'center' }}>CONTENTS</DialogContent>
      ACTIONS
    </Dialog>
  )
}
