import React, { Dispatch, SetStateAction } from 'react'

import Stack from '@mui/material/Stack'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import { Dayjs } from 'dayjs'
import { theme } from '~/styles/theme'

export type DateValue = Dayjs | null

interface DateRangeFilterProps {
  from: DateValue
  to: DateValue
  setFrom: Dispatch<SetStateAction<DateValue>>
  setTo: Dispatch<SetStateAction<DateValue>>
}

/**
 * Two side-by-side {@link DateTimePicker}s to set the values of `props.from` and `props.to` with a Dayjs date and time
 */
export const DateRangeFilter: React.FC<DateRangeFilterProps> = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ padding: theme.spacing(3, 1, 0) }}
      >
        <DateTimePicker
          label="From"
          value={props.from}
          onChange={(newValue) => props.setFrom(newValue)}
        />
        <DateTimePicker
          label="To"
          value={props.to}
          onChange={(newValue) => props.setTo(newValue)}
        />
      </Stack>
    </LocalizationProvider>
  )
}
