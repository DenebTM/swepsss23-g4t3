import React, { Dispatch, SetStateAction } from 'react'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import { AccessPoint } from '~/models/accessPoint'
import { SensorStationUuid } from '~/models/sensorStation'

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
  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedSsId = Number(event.target.value) as SensorStationUuid
    props.setSensorStationId(selectedSsId)
  }

  return (
    <FormControl fullWidth>
      <InputLabel id={ssSelectLabelId}>Sensor Station</InputLabel>
      <Select<number>
        disabled={typeof props.accessPoint === 'undefined'}
        value={props.sensorStationId ?? ''}
        onChange={handleChange}
        label="Sensor Station"
        labelId={ssSelectLabelId}
      >
        {props.accessPoint?.sensorStations.map((ss: SensorStationUuid) => (
          <MenuItem
            key={ss}
            value={ss}
            // qqjf TODO check that ss is in PAIRING mode
          >
            Greenhouse {ss}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
