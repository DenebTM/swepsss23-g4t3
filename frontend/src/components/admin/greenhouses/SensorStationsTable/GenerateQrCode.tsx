import React, { useState } from 'react'

import QrCode2Icon from '@mui/icons-material/QrCode2'
import IconButton from '@mui/material/IconButton'

import { Tooltip } from '@component-lib/Tooltip'
import { SensorStationUuid } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

interface GenerateQrCodeProps {
  uuid: SensorStationUuid
}

/**
 * Button which opens a model to generate a QR code for a given greenhouse.
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

  return (
    <>
      <Tooltip title="Generate QR code" arrow>
        <IconButton onClick={handleIconClick} sx={{ color: theme.outline }}>
          <QrCode2Icon />
        </IconButton>
      </Tooltip>
      {qrDialogOpen}
    </>
  )
}
