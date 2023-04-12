import React from 'react'
import { useNavigate } from 'react-router-dom'

import DashboardIcon from '@mui/icons-material/Dashboard'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { Tooltip } from '@component-lib/Tooltip'
import { SensorStationView, URL } from '~/common'
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

  // qqjf TODO move actions into common
  const actionIcons = [
    {
      title: 'Overview',
      icon: <DashboardIcon />,
      url: URL.greenhouseView(
        props.sensorStationUuid,
        SensorStationView.GRAPHICAL
      ),
    },
    {
      title: 'Gallery',
      icon: <ImageOutlinedIcon />,
      url: URL.greenhouseView(
        props.sensorStationUuid,
        SensorStationView.GALLERY
      ),
    },
    {
      title: 'Data Tables',
      icon: <StorageOutlinedIcon />,
      url: URL.greenhouseView(props.sensorStationUuid, SensorStationView.TABLE),
    },
  ]

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
        {actionIcons.map((iconButton) => (
          <Tooltip arrow title={iconButton.title} key={iconButton.title}>
            <IconButton
              onClick={() => navigate(iconButton.url)}
              color="inherit"
              size="small"
            >
              {iconButton.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  )
}
