import React, { useState } from 'react'

import QrCode2Icon from '@mui/icons-material/QrCode2'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'

import { Tooltip } from '@component-lib/Tooltip'
import { SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { QrDialogActions } from './QrDialogActions'
import { QrDialogHeader } from './QrDialogHeader'

interface GenerateQrCodeProps {
  uuid: SensorStationUuid
}

/**
 * Button which opens a modal containing a QR code for a given greenhouse.
 */
export const GenerateQrCode: React.FC<GenerateQrCodeProps> = (
  props
): JSX.Element => {
  const [qrDialogOpen, setQrDialogOpen] = useState(false)

  /** Open the QR generation dialog when the icon is clicked */
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent selecting the cell on click
    setQrDialogOpen(true)
  }

  const handleClose = () => {
    setQrDialogOpen(false)
  }

  return (
    <>
      <Tooltip title="Generate QR code" arrow>
        <IconButton onClick={handleIconClick} sx={{ color: theme.outline }}>
          <QrCode2Icon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={qrDialogOpen}
        onClose={handleClose}
        aria-labelledby="qr-dialog-title"
        aria-describedby="qr-dialog-description"
        PaperProps={{ sx: { minWidth: '70%', padding: theme.spacing(2, 2) } }}
      >
        <QrDialogHeader
          handleClose={handleClose}
          titleId="qr-dialog-title"
          uuid={props.uuid}
        />

        <DialogContent>QR CODE HERE</DialogContent>
        <QrDialogActions />
      </Dialog>
    </>
  )
}
