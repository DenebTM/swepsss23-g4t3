import React from 'react'
import { useNavigate } from 'react-router-dom'

import DashboardIcon from '@mui/icons-material/Dashboard'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import ButtonGroup from '@mui/material/ButtonGroup'
import { styled } from '@mui/material/styles'

import { PAGE_URL, SensorStationView } from '~/common'
import { SensorStationUuid } from '~/models/sensorStation'

import { SegmentedButton } from './SegmentedButton'

const borderRadius = '40px'
const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  '& .MuiButtonGroup-grouped': {
    borderRadius: 0,
    margin: 0,
    padding: theme.spacing(1, 2),
  },
}))

interface GreenhouseSegmentedButtonsProps {
  uuid: SensorStationUuid
  view: SensorStationView
}

/**
 * Button group showing the currently selected view in the greenhouse pages.
 * Infers which button should be selected from the URL search params.
 */
export const GreenhouseSegmentedButtons: React.FC<
  GreenhouseSegmentedButtonsProps
> = (props) => {
  const navigate = useNavigate()

  /** Define buttons for all views */
  const views = [
    {
      name: 'Overview',
      key: SensorStationView.GRAPHICAL,
      icon: <DashboardIcon />,
      loggedInOnly: true,
    },
    {
      name: 'Gallery',
      key: SensorStationView.GALLERY,
      icon: <ImageOutlinedIcon />,
      loggedInOnly: false,
    },
    {
      name: 'Table',
      key: SensorStationView.TABLE,
      icon: <StorageOutlinedIcon />,
      loggedInOnly: true,
    },
  ]

  /** Handle navigate to targetView on button click */
  const handleNavigate = (targetView: SensorStationView): void => {
    navigate(PAGE_URL.greenhouseView.href(props.uuid, targetView))
  }

  return (
    <div>
      <StyledButtonGroup>
        {views.map((btn, index: number) => (
          <SegmentedButton
            key={btn.key}
            onClick={() => handleNavigate(btn.key)}
            icon={btn.icon}
            selected={props.view === btn.key}
            aria-label={'Navigate to greenhouse ' + btn.key.toLowerCase()}
            loggedInOnly={btn.loggedInOnly}
            sx={{
              borderRadius:
                index === 0
                  ? `${borderRadius} 0 0 ${borderRadius}`
                  : index === views.length - 1
                  ? `0 ${borderRadius} ${borderRadius} 0`
                  : '',
            }}
          >
            {btn.name}
          </SegmentedButton>
        ))}
      </StyledButtonGroup>
    </div>
  )
}
