import React, { Dispatch, SetStateAction } from 'react'

import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { GridRenderCellParams } from '@mui/x-data-grid'

import { ChipVariant, RemovableChip } from '@component-lib/RemovableChip'
import { Tooltip } from '@component-lib/Tooltip'
import { deleteSensorStation } from '~/api/endpoints/sensorStations/sensorStations'
import { emDash } from '~/common'
import { useLoadSensorStations, useSensorStations } from '~/hooks/appContext'
import { AccessPoint } from '~/models/accessPoint'
import { SensorStationUuid, StationStatus } from '~/models/sensorStation'

const statusToVariant = (status: string): ChipVariant => {
  switch (status.toUpperCase()) {
    case StationStatus.OFFLINE:
    case StationStatus.PAIRING_FAILED:
      return ChipVariant.ERROR
    case StationStatus.PAIRING:
      return ChipVariant.INFO
    case StationStatus.WARNING:
      return ChipVariant.WARNING
    case StationStatus.AVAILABLE.toLowerCase():
    case StationStatus.OK.toLowerCase():
    default:
      return ChipVariant.OK
  }
}

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
  const sensorStations = useSensorStations()

  /** Try to get sensor station status from loaded sensor stations */
  const getSsStatus = (sensorStationId: SensorStationUuid): string => {
    if (sensorStations !== null) {
      const foundSensorStation = sensorStations.find(
        (s) => s.ssID === sensorStationId
      )
      if (typeof foundSensorStation !== 'undefined') {
        return foundSensorStation.status.toLowerCase()
      }
    }

    return 'unknown' // Default value
  }

  const afterDelete = (ssID: SensorStationUuid): void => {
    // Reload sensor stations and set in AppContext
    loadSensorStations()

    // Remove sensor station id from row
    props.setRows((oldRows) => {
      if (typeof oldRows === 'undefined') {
        return []
      } else {
        return oldRows.map((row) =>
          props.row.name === row.name
            ? {
                ...props.row,
                sensorStations: props.row.sensorStations.filter(
                  (ss: SensorStationUuid) => ss !== ssID
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
        props.row.sensorStations
          .filter(
            (ssID) =>
              getSsStatus(ssID) !== StationStatus.AVAILABLE.toLowerCase()
          )
          .map((ssID: SensorStationUuid) => (
            <RemovableChip
              key={ssID}
              entityName="greenhouse"
              handleDelete={() => deleteSensorStation(ssID)}
              afterDelete={() => afterDelete(ssID)}
              label={
                <Stack spacing={0}>
                  <Typography variant="labelLarge" color="inherit">
                    Greenhouse {String(ssID)}
                  </Typography>
                  <Typography variant="labelSmall" color="onSurfaceVariant">
                    Status: {getSsStatus(ssID)}
                  </Typography>
                </Stack>
              }
              variant={statusToVariant(getSsStatus(ssID))}
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
