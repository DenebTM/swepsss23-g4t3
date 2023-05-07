import React, { useState } from 'react'

import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'

import { Tooltip } from '@component-lib/Tooltip'
import { GreenhouseIcon } from '~/common'
import { AccessPointId } from '~/models/accessPoint'
import { theme } from '~/styles/theme'

import { AddSensorStationDialog } from '../../AddSensorStationDialog/AddSensorStationDialog'

/** Size of "+" badge icon */
const plusBadgeSize = '14px'

interface AddSensorStationProps {
  accessPointId: AccessPointId
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
      // qqjf TODO trigger reload
    }

    return (
      <>
        <Tooltip title="Add a new greenhouse" arrow>
          <IconButton onClick={handleIconClick} sx={{ color: theme.outline }}>
            <Badge
              badgeContent="+"
              color="primary"
              overlap="circular"
              sx={{
                '& .MuiBadge-badge': {
                  minWidth: plusBadgeSize,
                  width: plusBadgeSize,
                  height: plusBadgeSize,
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
        />
      </>
    )
  }
)
