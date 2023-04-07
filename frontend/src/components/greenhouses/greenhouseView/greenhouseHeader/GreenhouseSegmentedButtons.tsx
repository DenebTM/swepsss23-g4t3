import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import DashboardIcon from '@mui/icons-material/Dashboard'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import ButtonGroup from '@mui/material/ButtonGroup'
import { styled } from '@mui/material/styles'

import { SensorStationView, SS_UUID_PARAM, URL } from '~/common'
import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { SensorStationUuid } from '~/models/sensorStation'

import {
  getSsUuidFromParams,
  getViewFromSearchParams,
} from '../greenhouseHelpers'
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

/**
 * Button group showing the currently selected view in the greenhouse pages.
 * Infers which button should be selected from the URL search params.
 */
export const GreenhouseSegmentedButtons: React.FC = () => {
  const params = useParams()
  const addSnackbarMessage = useAddSnackbarMessage()

  const [search] = useSearchParams()
  const [view, setView] = useState<SensorStationView>()
  const [uuid, setUuid] = useState<SensorStationUuid>()
  const navigate = useNavigate()

  /** Get sensor station UUID from URL params */
  useEffect(() => {
    setUuid(getSsUuidFromParams(params))
  }, [params[SS_UUID_PARAM]])

  /** Get page view from seach (query) params */
  useEffect(() => {
    setView(getViewFromSearchParams(search))
  }, [search])

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
    if (typeof uuid !== 'undefined') {
      navigate(URL.greenhouseView(uuid, targetView))
    } else {
      // If the UUID can not be inferred from the route
      addSnackbarMessage({
        header: 'Greenhouse ID could not be inferred from the URL',
        body: 'Return to the Dashboard or try again later',
        type: MessageType.ERROR,
      })
    }
  }

  return (
    <div>
      <StyledButtonGroup>
        {views.map((btn) => (
          <SegmentedButton
            key={btn.key}
            onClick={() => handleNavigate(btn.key)}
            icon={btn.icon}
            selected={view === btn.key}
            aria-label={'Navigate to greenhouse' + btn.key.toLowerCase()}
          >
            {btn.name}
          </SegmentedButton>
        ))}
      </StyledButtonGroup>
    </div>
  )
}
