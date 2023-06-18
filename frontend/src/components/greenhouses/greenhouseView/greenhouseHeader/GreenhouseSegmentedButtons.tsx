import React from 'react'
import { useNavigate } from 'react-router-dom'

import ButtonGroup from '@mui/material/ButtonGroup'
import { styled } from '@mui/material/styles'

import { GREENHOUSE_VIEWS, PAGE_URL, SensorStationView } from '~/common'
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
  ssID: SensorStationUuid
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

  /** Handle navigate to targetView on button click */
  const handleNavigate = (targetView: SensorStationView): void => {
    navigate(PAGE_URL.greenhouseView.href(props.ssID, targetView))
  }

  const getBtnBorderRadius = (index: number, numberOfButtons: number) => {
    if (index === 0) {
      return `${borderRadius} 0 0 ${borderRadius}`
    } else if (index === numberOfButtons - 1) {
      return `0 ${borderRadius} ${borderRadius} 0`
    } else {
      return ''
    }
  }

  return (
    <StyledButtonGroup>
      {GREENHOUSE_VIEWS.map((btn, index: number) => (
        <SegmentedButton
          key={btn.key}
          onClick={() => handleNavigate(btn.key)}
          icon={<btn.Icon />}
          selected={props.view === btn.key}
          aria-label={'Navigate to greenhouse ' + btn.key.toLowerCase()}
          loggedInOnly={btn.loggedInOnly}
          sx={{
            borderRadius: getBtnBorderRadius(index, GREENHOUSE_VIEWS.length),
          }}
        >
          {btn.title}
        </SegmentedButton>
      ))}
    </StyledButtonGroup>
  )
}
