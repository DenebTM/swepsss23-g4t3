import React, { Dispatch, SetStateAction } from 'react'

import Stack from '@mui/material/Stack'
import { GridRenderCellParams } from '@mui/x-data-grid'

import { RemovableChip } from '@component-lib/RemovableChip'
import { removeGardener } from '~/api/endpoints/sensorStations/gardeners'
import { emDash } from '~/common'
import { SensorStation } from '~/models/sensorStation'
import { Username } from '~/models/user'

interface GardenerChipsProps
  extends GridRenderCellParams<SensorStation, any, SensorStation> {
  setRows: Dispatch<SetStateAction<SensorStation[] | undefined>>
}

/**
 * A collection of chips displaying the gardeners assigned to a sensor station
 */
export const GardenerChips: React.FC<GardenerChipsProps> = (props) => {
  /** Update table rows after gardener is removed from sensor station */
  const afterDelete = (removedGardener: Username): void => {
    props.setRows((oldRows) => {
      if (typeof oldRows === 'undefined') {
        return []
      } else {
        return oldRows.map((row) =>
          props.row.uuid === row.uuid
            ? {
                ...props.row,
                gardeners: props.row.gardeners.filter(
                  (gardener: Username) => gardener !== removedGardener
                ),
              }
            : row
        )
      }
    })
  }

  return (
    <Stack spacing={1} padding={2} direction="row">
      {props.row.gardeners.length > 0
        ? props.row.gardeners.map((username: string, idx) => (
            <RemovableChip
              key={`${username}-${idx}`}
              entityName="gardener"
              handleDelete={() => removeGardener(props.row.uuid, username)}
              afterDelete={() => afterDelete(username)}
              label={username}
            />
          ))
        : emDash}
    </Stack>
  )
}
