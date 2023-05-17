import React, { Dispatch, SetStateAction } from 'react'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import { Tooltip } from '@component-lib/Tooltip'
import { useSensorStations } from '~/hooks/appContext'
import { AccessPoint } from '~/models/accessPoint'
import {
  SensorStation,
  SensorStationUuid,
  StationStatus,
} from '~/models/sensorStation'

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
): JSX.Element => {
  const sensorStations = useSensorStations()

  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedSsId = Number(event.target.value) as SensorStationUuid
    props.setSensorStationId(selectedSsId)
  }

  if (sensorStations === null) {
    return <div>qqjf TODO loading</div>
  } else {
    // Only show sensor stations which are in PAIRING mode for the selected access point
    const apSensorStations = sensorStations.filter(
      (ss) =>
        ss.apName === props.accessPoint?.name &&
        ss.status === StationStatus.PAIRING
    )
    // qqjf TODO handle no sensor stations available
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
          >
            {apSensorStations.map((ss: SensorStation) => (
              <MenuItem key={ss.ssID} value={ss.ssID}>
                Greenhouse {ss.ssID}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Tooltip>
    )
  }
}
