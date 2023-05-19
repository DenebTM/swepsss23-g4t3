import React, { Dispatch, SetStateAction } from 'react'

import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import { LogLevel } from '~/models/log'

const levelSelectLabelId = 'level-select-label'

interface LogLevelSelectProps {
  level: LogLevel[]
  setLevel: Dispatch<SetStateAction<LogLevel[]>>
}

/**
 * Select for log level
 */
export const LogLevelSelect: React.FC<LogLevelSelectProps> = (props) => {
  const handleChange = (
    event: SelectChangeEvent<LogLevel[]>,
    child: React.ReactNode
  ) => {
    const newValue = event.target.value as LogLevel[]
    props.setLevel(newValue)
  }

  return (
    <FormControl sx={{ width: '14em' }}>
      <InputLabel id={levelSelectLabelId}>Level</InputLabel>
      <Select<LogLevel[]>
        multiple
        value={props.level ?? []}
        onChange={handleChange}
        label="Level"
        labelId={levelSelectLabelId}
        renderValue={(selected) => selected.join(', ')}
      >
        {Object.values(LogLevel).map((l: LogLevel) => (
          <MenuItem key={l} value={l}>
            <Checkbox checked={props.level.includes(l)} />
            <ListItemText primary={l} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
