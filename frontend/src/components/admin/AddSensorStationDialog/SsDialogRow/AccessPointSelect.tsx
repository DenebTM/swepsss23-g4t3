import { cancelable } from 'cancelable-promise'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import { Spinner } from '@component-lib/Spinner'
import { getAccessPoints } from '~/api/endpoints/accessPoints'
import { useAddErrorSnackbar } from '~/hooks/snackbar'
import { AccessPoint, AccessPointId, ApStatus } from '~/models/accessPoint'

const apLabelId = 'select-access-point'

interface AccessPointSelectProps {
  accessPoint: AccessPoint | undefined
  setAccessPoint: Dispatch<SetStateAction<AccessPoint | undefined>>
}

/**
 * Select for the chosen access point to pair a new sensor station with
 */
export const AccessPointSelect: React.FC<AccessPointSelectProps> = (
  props
): JSX.Element => {
  const addErrorSnackbar = useAddErrorSnackbar()
  const [accessPoints, setAccessPoints] = useState<AccessPoint[] | undefined>()
  const [value, setValue] = useState<AccessPointId>(
    props.accessPoint?.name ?? ''
  )

  const [snackbarError, setSnackbarError] = useState<Error | null>(null)

  /** Load a list of access points from the API on component mount */
  useEffect(() => {
    const apsPromise = cancelable(getAccessPoints())
    apsPromise
      .then((data) => {
        // Filter out unconfirmed access points
        setAccessPoints(data.filter((ap) => ap.status !== ApStatus.UNCONFIRMED))
      })
      .catch((err: Error) => setSnackbarError(err))

    // Cancel the promise callbacks on component unmount
    return apsPromise.cancel
  }, [])

  /** Update select value */
  useEffect(() => {
    setValue(props.accessPoint?.name ?? '')
  }, [props.accessPoint])

  /** Create a new snackbar if {@link snackbarError} has been updated */
  useEffect(() => {
    if (snackbarError !== null) {
      addErrorSnackbar(snackbarError, 'Could not load access points')
    }
  }, [snackbarError])

  const handleChange = (event: SelectChangeEvent) => {
    const selectedApName = event.target.value as string
    const selectedAp = accessPoints?.find((ap) => ap.name === selectedApName)
    props.setAccessPoint(selectedAp)
  }

  return typeof accessPoints !== 'undefined' ? (
    <FormControl fullWidth>
      <InputLabel id={apLabelId}>Access Point</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        label="Access Point"
        labelId={apLabelId}
      >
        {accessPoints.map((ap: AccessPoint) => (
          <MenuItem
            key={ap.name}
            value={ap.name}
            disabled={[ApStatus.OFFLINE, ApStatus.UNCONFIRMED].includes(
              ap.status
            )}
          >
            {ap.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <Spinner />
  )
}
