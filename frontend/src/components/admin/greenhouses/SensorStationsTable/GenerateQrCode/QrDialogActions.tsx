import React from 'react'

import PrintIcon from '@mui/icons-material/Print'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'

import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'

const buttonMinWidth = '100px'

interface QrDialogActionsProps {
  qrCodeId: string
}

/**
 * Buttons to copy and print a given QR code
 */
export const QrDialogActions: React.FC<QrDialogActionsProps> = (
  props
): JSX.Element => {
  const addSnackbarMessage = useAddSnackbarMessage()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  /**
   * Handle click to print the QR code. Either opens a print window in the browser, or displays an error snackbar.
   */
  const handlePrint = () => {
    const openedPrintWindow = tryToPrintQrCode()
    if (!openedPrintWindow) {
      addSnackbarMessage({
        header: 'Print Error',
        body: 'Unable to open print window on your system.',
        type: MessageType.ERROR,
      })
    }
  }

  /**
   * Try to print QR code.
   * Returns `true` if successful and `false` otherwise.
   * @see https://stackoverflow.com/questions/30135387/how-to-print-react-component-on-click-of-a-button
   */
  const tryToPrintQrCode = (): boolean => {
    const qrCodeEl = document.getElementById(props.qrCodeId)

    if (qrCodeEl === null || iframeRef.current === null) {
      return false
    }
    const printWindow = iframeRef.current.contentWindow

    if (printWindow === null) {
      return false
    }

    printWindow.document.open()
    printWindow.document.write(qrCodeEl.innerHTML)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    return true
  }

  return (
    <DialogActions>
      <iframe
        id="print-iframe"
        style={{ height: 0, width: 0, position: 'absolute' }}
        ref={iframeRef}
      ></iframe>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PrintIcon />}
        onClick={handlePrint}
        sx={{ minWidth: buttonMinWidth }}
      >
        Print
      </Button>
    </DialogActions>
  )
}
