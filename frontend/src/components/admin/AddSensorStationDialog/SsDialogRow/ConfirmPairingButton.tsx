import React, { useState } from 'react'

import LoadingButton from '@mui/lab/LoadingButton'

import { updateSensorStation } from '~/api/endpoints/sensorStations/sensorStations'
import { MessageType } from '~/contexts/SnackbarContext/types'
import { useLoadSensorStations } from '~/hooks/appContext'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { SensorStationUuid, StationStatus } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

interface ConfirmPairingButtonProps {
  closeDialog: () => void
  sensorStationId: SensorStationUuid | undefined
}

/**
 * Button to confirm pairing with a new sensor station
 */
export const ConfirmPairingButton: React.FC<ConfirmPairingButtonProps> = (
  props
): JSX.Element => {
  const addSnackbarMessage = useAddSnackbarMessage()
  const loadSensorStations = useLoadSensorStations()
  const [confirming, setConfirming] = useState(false) // Loading indicator after user clicks "confirm"

  const handlePairWithSs = () => {
    if (typeof props.sensorStationId !== 'undefined') {
      // Button is disabled anyway, this typeguarding is for typescript
      setConfirming(true)
      updateSensorStation(props.sensorStationId, { status: StationStatus.OK })
        .then(() => {
          // Reload sensor stations and close modal
          loadSensorStations()
          props.closeDialog()
          addSnackbarMessage({
            header: 'Pairing request sent!',
            body: `Navigate to the Greenhouses page to view the updated status of Greenhouse ${props.sensorStationId}`,
            type: MessageType.CONFIRM,
          })
        })
        .catch((err: Error) => {
          addSnackbarMessage({
            header: 'Unable to pair with sensor station',
            body: err.message,
            type: MessageType.ERROR,
          })
        })
        .finally(() => {
          setConfirming(false)
        })
    }
  }

  return (
    <LoadingButton
      disabled={typeof props.sensorStationId === 'undefined'}
      variant="contained"
      onClick={handlePairWithSs}
      fullWidth
      size="large"
      loading={confirming}
      loadingPosition="center"
      color="primary"
      sx={{
        '&.MuiLoadingButton-loading': {
          background: theme.primary,
        },
      }}
    >
      Confirm
    </LoadingButton>
  )
}
