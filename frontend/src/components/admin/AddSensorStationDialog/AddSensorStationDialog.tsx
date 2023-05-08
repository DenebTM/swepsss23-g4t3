import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

import { DialogHeader } from '@component-lib/DialogHeader'
import { AccessPointId } from '~/models/accessPoint'
import { theme } from '~/styles/theme'

const dialogTitleId = 'add-sensorstation-dialog-title'

interface AddSensorStationDialogProps {
  accessPointId?: AccessPointId
  onClose: () => void
  open: boolean
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
      onClose={props.onClose}
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
