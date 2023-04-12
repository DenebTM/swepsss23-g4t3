import React from 'react'
import { useNavigate } from 'react-router-dom'

import DashboardIcon from '@mui/icons-material/Dashboard'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import ButtonGroup from '@mui/material/ButtonGroup'
import { styled } from '@mui/material/styles'

import { SensorStationView, URL } from '~/common'
import { SensorStationUuid } from '~/models/sensorStation'

import { SegmentedButton } from './SegmentedButton'

const borderRadius = '40px'
const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  '& .MuiButtonGroup-grouped': {
    borderRadius: 0,
    margin: 0,
    '&:first-of-type': {
      borderRadius: `${borderRadius} 0 0 ${borderRadius}`,
    },
    '&:last-of-type': {
      borderRadius: `0 ${borderRadius} ${borderRadius} 0`,
    },
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
    },
    {
      name: 'Gallery',
      key: SensorStationView.GALLERY,
      icon: <ImageOutlinedIcon />,
    },
    {
      name: 'Table',
      key: SensorStationView.TABLE,
      icon: <StorageOutlinedIcon />,
    },
  ]

  /** Handle navigate to targetView on button click */
  const handleNavigate = (targetView: SensorStationView): void => {
    navigate(URL.greenhouseView.href(props.uuid, targetView))
  }

  return (
    <div>
      <StyledButtonGroup>
        {views.map((btn) => (
          <SegmentedButton
            key={btn.key}
            onClick={() => handleNavigate(btn.key)}
            icon={btn.icon}
            selected={props.view === btn.key}
            aria-label={'Navigate to greenhouse ' + btn.key.toLowerCase()}
          >
            {btn.name}
          </SegmentedButton>
        ))}
      </StyledButtonGroup>
    </div>
  )
}
