import React from 'react'
import { useNavigate } from 'react-router-dom'

import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { Tooltip } from '@component-lib/Tooltip'
import { GREENHOUSE_VIEWS } from '~/common'
import { SensorStationUuid } from '~/models/sensorStation'

interface AccordionQuickActionsProps {
  sensorStationUuid: SensorStationUuid
}

/**
 * Display "Quick actions" in the greenhouse accordion summary.
 * Links to other greenhouse pages.
 */
export const AccordionQuickActions: React.FC<AccordionQuickActionsProps> = (
  props
) => {
  const navigate = useNavigate()

  return (
    <Box
      component="span"
      display="flex"
      alignItems="center"
      flexDirection="row"
      flexWrap="wrap"
    >
      <Typography marginRight={1}>Quick actions:</Typography>
      <Box component="span">
        {GREENHOUSE_VIEWS.map((btn) => (
          <Tooltip arrow title={btn.title} key={btn.title}>
            <IconButton
              onClick={() => navigate(btn.url(props.sensorStationUuid))}
              color="inherit"
              size="small"
            >
              <btn.Icon />
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  )
}
