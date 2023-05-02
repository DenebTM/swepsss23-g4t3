import React, { useState } from 'react'
import QRCode from 'react-qr-code'

import QrCode2Icon from '@mui/icons-material/QrCode2'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'

import { Tooltip } from '@component-lib/Tooltip'
import { PAGE_URL } from '~/common'
import { SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { QrDialogActions } from './QrDialogActions'
import { QrDialogHeader } from './QrDialogHeader'

/** ID used to locate and print the QR code in the window */
const qrCodeId = 'qr-code-contents'

/** QR code side length in px */
const qrSize = 256

interface GenerateQrCodeProps {
  uuid: SensorStationUuid
}

/**
 * Button which opens a modal containing a QR code for a given greenhouse.
 * Memoised using `React.memo` as otherwise DataGrid causes rerenders which in turn cause QR code regeneration.
 */
export const GenerateQrCode: React.FC<GenerateQrCodeProps> = React.memo(
  (props): JSX.Element => {
    const [qrDialogOpen, setQrDialogOpen] = useState(false)

    const uploadUrl = `${window.location.origin}${PAGE_URL.photoUpload.href(
      props.uuid
    )}`

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
          PaperProps={{
            sx: { minWidth: '70%', padding: theme.spacing(1, 3, 2) },
          }}
        >
          <QrDialogHeader
            handleClose={handleClose}
            titleId="qr-dialog-title"
            uuid={props.uuid}
          />

          <DialogContent sx={{ textAlign: 'center' }} id={qrCodeId}>
            <QRCode
              size={qrSize}
              style={{ height: 'auto', maxWidth: '50%', width: '50%' }}
              value={uploadUrl}
              viewBox={`0 0 ${qrSize} ${qrSize}`}
            />
          </DialogContent>
          <QrDialogActions qrCodeId={qrCodeId} />
        </Dialog>
      </>
    )
  }
)
