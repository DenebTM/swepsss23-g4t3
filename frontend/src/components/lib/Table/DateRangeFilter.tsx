import React, { Dispatch, SetStateAction } from 'react'

import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
  DateTimePicker,
  DateTimePickerSlotsComponentsProps,
} from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import dayjs, { Dayjs } from 'dayjs'

export type DateValue = Dayjs | null

interface DateRangeFilterProps {
  children?: React.ReactNode
  from: DateValue
  to: DateValue
  setFrom: Dispatch<SetStateAction<DateValue>>
  setTo: Dispatch<SetStateAction<DateValue>>
}

/**
 * Two side-by-side {@link DateTimePicker}s to set the values of `props.from` and `props.to` with a Dayjs date and time
 */
export const DateRangeFilter: React.FC<DateRangeFilterProps> = (props) => {
  const theme = useTheme()

  const pickerStyleProps: Partial<
    DateTimePickerSlotsComponentsProps<DateValue>
  > = {
    day: {
      sx: {
        '&.Mui-disabled': {
          background: theme.ref.neutral[95],
        },
      },
    },
  }

  const breakMd = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        direction={breakMd ? 'column' : 'row'}
        spacing={2}
        sx={{
          padding: theme.spacing(3, 1, 2),
          placeItems: 'flex-start',
        }}
      >
        <DateTimePicker
          label="From"
          value={props.from}
          onChange={(newValue) => props.setFrom(newValue)}
          disableFuture
          views={['year', 'month', 'day', 'hours', 'minutes']}
          slotProps={{
            textField: {
              helperText: props.from?.isAfter(dayjs())
                ? 'Select a date in the past'
                : '',
            },
            ...pickerStyleProps,
          }}
        />
        <DateTimePicker
          label="To"
          value={props.to}
          onChange={(newValue) => props.setTo(newValue)}
          disableFuture
          minDate={props.from /** Must be after the from value */}
          minTime={
            /** Check that `props.to` is later in time of day than `props.from` only if `props.from` and `props.to` are on same day */
            props.from?.format('YYYYMMDD') === props.to?.format('YYYYMMDD')
              ? props.from
              : undefined
          }
          views={['year', 'month', 'day', 'hours', 'minutes']}
          slotProps={{
            textField: {
              helperText: props.from?.isAfter(props.to)
                ? 'Select a date after "From"'
                : props.to?.isAfter(dayjs())
                ? 'Select a date in the past'
                : '',
            },
            ...pickerStyleProps,
          }}
        />
        {props.children}
      </Stack>
    </LocalizationProvider>
  )
}
