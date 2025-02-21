import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'

import { Spinner } from '@component-lib/Spinner'
import { Tooltip } from '@component-lib/Tooltip'
import { useSensorStations } from '~/hooks/appContext'
import { AccessPoint } from '~/models/accessPoint'
import { SensorStationUuid, StationStatus } from '~/models/sensorStation'

const ssSelectLabelId = 'select-sensor-station'

interface SensorStationSelectProps {
  accessPoint: AccessPoint | undefined
  sensorStationId: SensorStationUuid | undefined
  setSensorStationId: Dispatch<SetStateAction<SensorStationUuid | undefined>>
}

/**
 * Select for the chosen access point to pair a new sensor station with
 */
export const SensorStationSelect: React.FC<SensorStationSelectProps> = (
  props
): React.ReactElement => {
  const theme = useTheme()

  const sensorStations = useSensorStations()

  const [apSensorStations, setApSensorStations] = useState<SensorStationUuid[]>(
    []
  )

  /** Only show sensor stations which are in PAIRING mode for the selected access point */
  useEffect(() => {
    setApSensorStations(
      sensorStations === null
        ? []
        : sensorStations
            .filter(
              (ss) =>
                ss.apName === props.accessPoint?.name &&
                ss.status === StationStatus.AVAILABLE
            )
            .map((ss) => ss.ssID)
    )
  }, [sensorStations])

  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedSsId: SensorStationUuid = Number(event.target.value)
    props.setSensorStationId(selectedSsId)
  }

  if (sensorStations === null) {
    return <Spinner center />
  } else {
    return (
      <Tooltip
        arrow
        title={
          typeof props.accessPoint === 'undefined'
            ? 'Select an access point first'
            : apSensorStations.length > 0
            ? ''
            : 'No sensor stations are in pairing mode. Did you press the button on the sensor station?'
        }
        spanSx={{ width: '100%' }}
      >
        <FormControl fullWidth>
          <InputLabel id={ssSelectLabelId}>Sensor Station</InputLabel>
          <Select<number>
            disabled={
              typeof props.accessPoint === 'undefined' ||
              apSensorStations.length === 0
            }
            value={props.sensorStationId ?? ''}
            onChange={handleChange}
            label="Sensor Station"
            labelId={ssSelectLabelId}
            sx={{
              '&.Mui-disabled': {
                background: theme.inverseOnSurface,
              },
            }}
          >
            {apSensorStations.map((ssID) => (
              <MenuItem key={ssID} value={ssID}>
                Greenhouse {ssID}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Tooltip>
    )
  }
}
