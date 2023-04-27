import React from 'react'

import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PrintIcon from '@mui/icons-material/Print'
import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'

const buttonMinWidth = '100px'

/**
 * Buttons to copy and print a given QR code
 */
export const QrDialogActions: React.FC = (props): JSX.Element => {
  return (
    <DialogActions>
      <LoadingButton
        variant="outlined"
        onClick={undefined}
        loading={false}
        loadingPosition="center"
        startIcon={<ContentCopyIcon />}
        color="primary"
        sx={{ minWidth: buttonMinWidth }}
      >
        Copy
      </LoadingButton>
      <Button
        onClick={undefined}
        variant="contained"
        color="primary"
        startIcon={<PrintIcon />}
        sx={{ minWidth: buttonMinWidth }}
      >
        Print
      </Button>
    </DialogActions>
  )
}
