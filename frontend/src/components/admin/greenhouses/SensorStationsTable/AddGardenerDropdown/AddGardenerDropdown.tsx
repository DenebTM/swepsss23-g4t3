import { cancelable } from 'cancelable-promise'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import PersonAddIcon from '@mui/icons-material/PersonAdd'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'

import { Tooltip } from '@component-lib/Tooltip'
import { getUsers } from '~/api/endpoints/user'
import { useAddErrorSnackbar } from '~/hooks/snackbar'
import { SensorStation } from '~/models/sensorStation'
import { AuthUserRole, User } from '~/models/user'

import { GardenerSelect } from './GardenerSelect'

/** Update child components whenever props.sensorStation is updated */
const propsAreEqual = (
  prevProps: AddGardenerDropdownProps,
  nextProps: AddGardenerDropdownProps
) =>
  JSON.stringify(prevProps.sensorStation) ===
  JSON.stringify(nextProps.sensorStation)

interface AddGardenerDropdownProps {
  sensorStation: SensorStation
  setSensorStations: Dispatch<SetStateAction<SensorStation[] | undefined>>
}

/**
 * Button which opens a select to assign a new gardener to a sensor station.
 * Memoised using `React.memo` as otherwise DataGrid causes unnecessary rerenders.
 */
export const AddGardenerDropdown: React.FC<AddGardenerDropdownProps> =
  React.memo((props): JSX.Element => {
    const theme = useTheme()

    const addErrorSnackbar = useAddErrorSnackbar()

    const [potentialGardeners, setPotentialGardeners] = useState<User[]>()
    const [selectOpen, setSelectOpen] = useState(false)
    const [snackbarError, setSnackbarError] = useState<Error | null>(null)

    /** Load users from the API on component mount and whenever `props.sensorStation` has been updated */
    useEffect(() => {
      const usersPromise = cancelable(getUsers())
      usersPromise
        .then((data) => {
          /** Filter usernames to only include users who
           * 1) Are admins or gardeners
           * 2) Are not already gardeners for this sensor station
           * 3) Whose name matches the search query (case-insensitive) */
          const filteredUsers = data.filter(
            (u: User) =>
              [AuthUserRole.ADMIN, AuthUserRole.GARDENER].includes(
                u.userRole
              ) && !props.sensorStation.gardeners.includes(u.username)
          )
          setPotentialGardeners(filteredUsers)
        })
        .catch((err: Error) => setSnackbarError(err))

      // Cancel the promise callbacks on component unmount
      return usersPromise.cancel
    }, [props.sensorStation])

    /** Create a new snackbar if {@link snackbarError} has been updated */
    useEffect(() => {
      if (snackbarError !== null) {
        addErrorSnackbar(snackbarError, 'Could not load users')
      }
    }, [snackbarError])

    /** Open the gardener select when the icon is clicked */
    const handleIconClick = (e: React.MouseEvent) => {
      e.stopPropagation() // Prevent selecting the table cell on click
      setSelectOpen(true)
    }

    const canAssignNewGardeners = () =>
      typeof potentialGardeners !== 'undefined' && potentialGardeners.length > 0

    return (
      <>
        <Tooltip
          title={
            canAssignNewGardeners()
              ? 'Assign gardener to greenhouse'
              : 'No more users can be assigned to this greenhouse'
          }
          arrow
        >
          <IconButton
            onClick={handleIconClick}
            disabled={!canAssignNewGardeners()}
            sx={{ background: selectOpen ? theme.outlineVariant : '' }}
          >
            <PersonAddIcon
              sx={{
                color: canAssignNewGardeners()
                  ? theme.outline
                  : theme.outlineVariant,
              }}
            />
          </IconButton>
        </Tooltip>

        {typeof potentialGardeners !== 'undefined' &&
          canAssignNewGardeners() && (
            <GardenerSelect
              open={selectOpen}
              sensorStation={props.sensorStation}
              potentialGardeners={potentialGardeners.map((u) => u.username)}
              setOpen={setSelectOpen}
              setSensorStations={props.setSensorStations}
            />
          )}
      </>
    )
  }, propsAreEqual)
