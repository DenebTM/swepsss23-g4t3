import React from 'react'

import Stack from '@mui/material/Stack'
import { GridRenderCellParams } from '@mui/x-data-grid'

import { RemovableChip } from '@component-lib/RemovableChip'
import { Tooltip } from '@component-lib/Tooltip'
import { emDash } from '~/common'
import { AccessPoint } from '~/models/accessPoint'
import { SensorStationUuid } from '~/models/sensorStation'

/**
 * A collection of chips displaying the sensor stations which transmit data to a given access point
 */
export const SensorStationChips: React.FC<
  GridRenderCellParams<AccessPoint, any, AccessPoint>
> = (props) => {
  return (
    <Stack spacing={1} padding={2} direction="row">
      {props.row.sensorStations.length > 0 ? (
        props.row.sensorStations.map((uuid: SensorStationUuid) => (
          <RemovableChip
            key={uuid}
            entityName="greenhouse"
            handleDelete={() =>
              Promise.reject({
                message: 'Removing greenhouses not implemented yet',
              })
            }
            label={String(uuid)}
          />
        ))
      ) : (
        <Tooltip
          title={`No greenhouses are connected to ${props.row.name}`}
          arrow
        >
          <>{emDash}</>
        </Tooltip>
      )}
    </Stack>
  )
}
