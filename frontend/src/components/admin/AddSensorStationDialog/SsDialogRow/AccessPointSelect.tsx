import { cancelable } from 'cancelable-promise'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import { getAccessPoints } from '~/api/endpoints/accessPoints'
import { Message, MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { AccessPoint } from '~/models/accessPoint'
import { ApStatus } from '~/models/accessPoint'

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
  const addSnackbarMessage = useAddSnackbarMessage()
  const [accessPoints, setAccessPoints] = useState<AccessPoint[] | undefined>()

  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /** Load a list of access points from the API on component mount */
  useEffect(() => {
    const apsPromise = cancelable(getAccessPoints())
    apsPromise
      .then((data) => {
        // Filter out unconfirmed access points
        setAccessPoints(data.filter((ap) => ap.status !== ApStatus.UNCONFIRMED))
      })
      .catch((err: Error) =>
        setSnackbarMessage({
          header: 'Could not load access points',
          body: err.message,
          type: MessageType.ERROR,
        })
      )

    // Cancel the promise callbacks on component unmount
    return apsPromise.cancel
  }, [])

  /** Create a new snackbar if {@link snackbarMessage} has been updated */
  useEffect(() => {
    if (snackbarMessage !== null) {
      addSnackbarMessage(snackbarMessage)
    }
  }, [snackbarMessage])

  const handleChange = (event: SelectChangeEvent) => {
    const selectedApName = event.target.value as string
    const selectedAp = accessPoints?.find((ap) => ap.name === selectedApName)
    props.setAccessPoint(selectedAp)
  }

  return typeof accessPoints !== 'undefined' ? (
    <FormControl fullWidth>
      <InputLabel id={apLabelId}>Access Point</InputLabel>
      <Select
        value={props.accessPoint?.name ?? ''}
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
    <div>qqjf todo loading</div>
  )
}
