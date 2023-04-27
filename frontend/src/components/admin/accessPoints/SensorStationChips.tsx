import React, { Dispatch, SetStateAction } from 'react'

import Stack from '@mui/material/Stack'
import { GridRenderCellParams } from '@mui/x-data-grid'

import { RemovableChip } from '@component-lib/RemovableChip'
import { Tooltip } from '@component-lib/Tooltip'
import { deleteSensorStation } from '~/api/endpoints/sensorStations/sensorStations'
import { emDash } from '~/common'
import { useLoadSensorStations } from '~/hooks/appContext'
import { AccessPoint } from '~/models/accessPoint'
import { SensorStationUuid } from '~/models/sensorStation'

interface SensorStationChipsProps
  extends GridRenderCellParams<AccessPoint, any, AccessPoint> {
  setRows: Dispatch<SetStateAction<AccessPoint[] | undefined>>
}
/**
 * A collection of chips displaying the sensor stations which transmit data to a given access point
 */
export const SensorStationChips: React.FC<SensorStationChipsProps> = (
  props
) => {
  const loadSensorStations = useLoadSensorStations()

  const afterDelete = (uuid: SensorStationUuid): void => {
    // Reload sensor stations and set in AppContext
    loadSensorStations()

    // Remove sensor station id from row
    props.setRows((oldRows) => {
      if (typeof oldRows === 'undefined') {
        return []
      } else {
        return oldRows.map((row) =>
          props.row.apId === row.apId
            ? {
                ...props.row,
                sensorStations: props.row.sensorStations.filter(
                  (ss: SensorStationUuid) => ss !== uuid
                ),
              }
            : row
        )
      }
    })
  }

  return (
    <Stack spacing={1} padding={2} direction="row">
      {props.row.sensorStations.length > 0 ? (
        props.row.sensorStations.map((uuid: SensorStationUuid) => (
          <RemovableChip
            key={uuid}
            entityName="greenhouse"
            handleDelete={() => deleteSensorStation(uuid)}
            afterDelete={() => afterDelete(uuid)}
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
