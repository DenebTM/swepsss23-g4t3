import React, { Dispatch, SetStateAction, useState } from 'react'

import CheckIcon from '@mui/icons-material/Check'
import IconButton from '@mui/material/IconButton'

import { Tooltip } from '@component-lib/Tooltip'
import { updateAccessPoint } from '~/api/endpoints/accessPoints'
import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { AccessPoint, ApStatus } from '~/models/accessPoint'
import { theme } from '~/styles/theme'

interface ConfirmAccessPointProps {
  accessPoint: AccessPoint
  setAccessPoints: Dispatch<SetStateAction<AccessPoint[] | undefined>>
}

/**
 * Confirm adding a new access point.
 * Memoised using `React.memo` as otherwise DataGrid causes unnecessary rerenders.
 */
export const ConfirmAccessPoint: React.FC<ConfirmAccessPointProps> = React.memo(
  (props): JSX.Element => {
    const addSnackbarMessage = useAddSnackbarMessage()
    const [updating, setUpdating] = useState(false)

    /** Open the dialog to add a sensor station when the icon is clicked */
    const handleIconClick = (e: React.MouseEvent) => {
      e.stopPropagation() // Prevent selecting the cell on click
      setUpdating(true)
      updateAccessPoint(props.accessPoint.name, { status: ApStatus.ONLINE })
        .then((updatedAp) => {
          console.log(updatedAp)
          // Update table row
          props.setAccessPoints((oldAps) => {
            if (typeof oldAps === 'undefined') {
              return [updatedAp]
            } else {
              return oldAps.map((ap) =>
                updatedAp.name === ap.name ? updatedAp : ap
              )
            }
          })
        })
        .catch((err: Error) => {
          addSnackbarMessage({
            header: 'Unable to update access point',
            body: err.message,
            type: MessageType.ERROR,
          })
        })
        .finally(() => {
          setUpdating(false)
        })
    }

    return (
      <Tooltip
        title={updating ? 'Updating....' : 'Confirm access point connection'}
        arrow
      >
        <IconButton
          onClick={handleIconClick}
          sx={{
            color: theme.onPrimaryContainer,
            background: theme.primaryContainer,
            '&:hover': {
              background: theme.outlineVariant,
              transition: theme.transitions.create('background'),
            },
          }}
          disabled={updating}
        >
          <CheckIcon />
        </IconButton>
      </Tooltip>
    )
  }
)
