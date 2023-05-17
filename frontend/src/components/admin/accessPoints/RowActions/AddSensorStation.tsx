import React, { Dispatch, SetStateAction, useState } from 'react'

import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'

import { Tooltip } from '@component-lib/Tooltip'
import { GreenhouseIcon } from '~/common'
import { AccessPoint, AccessPointId, ApStatus } from '~/models/accessPoint'
import { theme } from '~/styles/theme'

import { AddSensorStationDialog } from '../../AddSensorStationDialog/AddSensorStationDialog'

/** Size of "+" badge icon */
const plusBadgeSize = '14px'

interface AddSensorStationProps {
  accessPointId: AccessPointId
  setAccessPoints: Dispatch<SetStateAction<AccessPoint[] | undefined>>
  status: ApStatus
}

/**
 * Button which opens a dialog to add a new sensor station to a given greenhouse.
 * Memoised using `React.memo` as otherwise DataGrid causes unnecessary rerenders.
 */
export const AddSensorStation: React.FC<AddSensorStationProps> = React.memo(
  (props): JSX.Element => {
    const [addSsDialogOpen, setAddSsDialogOpen] = useState(false)

    /** Open the dialog to add a sensor station when the icon is clicked */
    const handleIconClick = (e: React.MouseEvent) => {
      e.stopPropagation() // Prevent selecting the cell on click
      setAddSsDialogOpen(true)
    }

    /** Handle closing the dialog to add a sensor station */
    const handleClose = () => {
      setAddSsDialogOpen(false)
    }

    /** Update value of access point in parent state */
    const handleUpdateApInState = (updatedAp: AccessPoint) =>
      props.setAccessPoints((oldAps: AccessPoint[] | undefined) => {
        if (typeof oldAps === 'undefined') {
          return [updatedAp]
        } else {
          return oldAps.map((ap: AccessPoint) =>
            ap.name === updatedAp.name ? updatedAp : ap
          )
        }
      })

    /** Whether to disable adding a new sensor station to this access point */
    const disabled = [ApStatus.OFFLINE, ApStatus.UNCONFIRMED].includes(
      props.status
    )

    return (
      <>
        <Tooltip
          title={
            disabled
              ? `Access point ${props.status.toLowerCase()}`
              : 'Add a new greenhouse'
          }
          arrow
        >
          <IconButton
            onClick={handleIconClick}
            sx={{ color: theme.outline }}
            disabled={disabled}
          >
            <Badge
              badgeContent="+"
              overlap="circular"
              sx={{
                '& .MuiBadge-badge': {
                  minWidth: plusBadgeSize,
                  width: plusBadgeSize,
                  height: plusBadgeSize,
                  backgroundColor: disabled ? theme.outline : theme.primary,
                  color: disabled ? theme.surface : theme.onPrimary,
                },
              }}
            >
              <GreenhouseIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <AddSensorStationDialog
          accessPointId={props.accessPointId}
          open={addSsDialogOpen}
          onClose={handleClose}
          updateApInState={handleUpdateApInState}
        />
      </>
    )
  }
)
