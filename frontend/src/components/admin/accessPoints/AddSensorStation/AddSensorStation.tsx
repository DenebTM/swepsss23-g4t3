import React, { useState } from 'react'

import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'

import { Tooltip } from '@component-lib/Tooltip'
import { GreenhouseIcon } from '~/common'
import { AccessPointId } from '~/models/accessPoint'
import { theme } from '~/styles/theme'

import { AddSensorStationModal } from '../../AddSensorStationDialog/AddSensorStationDialog'

/** Size of "+" badge icon */
const plusBadgeSize = '14px'

interface AddSensorStationProps {
  accessPointId: AccessPointId
}

/**
 * Button which opens a modal to add a new sensor station to a given greenhouse.
 * Memoised using `React.memo` as otherwise DataGrid causes unnecessary rerenders.
 */
export const AddSensorStation: React.FC<AddSensorStationProps> = React.memo(
  (props): JSX.Element => {
    const [addSsModalOpen, setAddSsModalOpen] = useState(false)

    /** Open the modal to add a sensor station when the icon is clicked */
    const handleIconClick = (e: React.MouseEvent) => {
      e.stopPropagation() // Prevent selecting the cell on click
      setAddSsModalOpen(true)
    }

    /** Handle closing the modal to add a sensor station */
    const handleClose = () => {
      setAddSsModalOpen(false)
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
        <AddSensorStationModal
          accessPointId={props.accessPointId}
          open={addSsModalOpen}
          onClose={handleClose}
        />
      </>
    )
  }
)
