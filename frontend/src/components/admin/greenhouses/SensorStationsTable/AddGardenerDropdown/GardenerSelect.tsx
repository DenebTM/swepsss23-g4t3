import React, { Dispatch, SetStateAction, useState } from 'react'

import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import { assignGardener } from '~/api/endpoints/sensorStations/gardeners'
import { useAddErrorSnackbar } from '~/hooks/snackbar'
import { SensorStation } from '~/models/sensorStation'
import { Username } from '~/models/user'

import { SelectSearchField } from './SelectSearchField'

interface GardenerSelectProps {
  open: boolean
  sensorStation: SensorStation
  potentialGardeners: Username[]
  setOpen: Dispatch<SetStateAction<boolean>>
  setSensorStations: Dispatch<SetStateAction<SensorStation[] | undefined>>
}

/**
 * Searchable select used to add gardeners to a sensor station
 * @see https://www.npmjs.com/package/react-searchable-select-mui
 */
export const GardenerSelect: React.FC<GardenerSelectProps> = (props) => {
  const addErrorSnackbar = useAddErrorSnackbar()
  const [search, setSearch] = useState('')

  const resetSearch = () => setSearch('')

  const handleChange = (event: SelectChangeEvent) => {
    const selectedUser = event.target.value as string

    assignGardener(props.sensorStation.ssID, selectedUser)
      .then((updatedSs: SensorStation) => {
        // Update sensor station in state
        props.setSensorStations((oldValue) => {
          if (typeof oldValue === 'undefined') {
            return []
          } else {
            return oldValue.map((ss: SensorStation) =>
              props.sensorStation.ssID === ss.ssID ? updatedSs : ss
            )
          }
        })
      })
      .catch((err: Error) => {
        addErrorSnackbar(err, 'Unable to assign gardener to greenhouse')
      })
  }

  const handleCloseSelect = (): void => {
    props.setOpen(false)
    resetSearch()
  }

  return (
    <FormControl
      margin="normal"
      fullWidth
      sx={{
        // Hide the standard dropdown icon
        '& .MuiInputBase-root': { visibility: 'hidden' },
      }}
    >
      <Select
        value=""
        onChange={handleChange}
        label="Username"
        open={props.open}
        onClose={handleCloseSelect}
        MenuProps={{
          onClose: resetSearch,
          disableAutoFocusItem: true,
          MenuListProps: {
            disableListWrap: true,
          },
        }}
      >
        <SelectSearchField
          closeSelect={handleCloseSelect}
          setSearch={setSearch}
        />

        {props.potentialGardeners
          .filter((u: Username) =>
            u.toLowerCase().includes(search.toLowerCase())
          )
          .map((username) => (
            <MenuItem key={username} value={username}>
              {username}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  )
}
