import React from 'react'
import { useNavigate } from 'react-router-dom'

import Stack from '@mui/material/Stack'
import { GridRenderCellParams } from '@mui/x-data-grid'

import { RemovableChip } from '@component-lib/RemovableChip'
import { PAGE_URL } from '~/common'
import { SensorStation } from '~/models/sensorStation'

/**
 * A collection of chips displaying the gardeners assigned to a sensor station
 */
export const GardenerChips: React.FC<
  GridRenderCellParams<SensorStation, any, SensorStation>
> = (props) => {
  const navigate = useNavigate()

  return (
    <Stack spacing={1} padding={2} direction="row">
      {props.row.gardeners.map((username: string, idx) => (
        <RemovableChip
          key={`${username}-${idx}`}
          entityName="gardener"
          handleDelete={() =>
            Promise.reject({
              message: 'Removing gardeners not implemented yet',
            })
          }
          label={username}
          onClick={() => navigate(PAGE_URL.manageUsers.href)}
          tooltipTitle="Manage users"
        />
      ))}
    </Stack>
  )
}
