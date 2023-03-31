import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@mui/material/Button'

import { logout } from '~/api/endpoints/login'
import { getUsers } from '~/api/endpoints/user'
import { URL } from '~/common'
import { PageWrapper } from '~/components/page/PageWrapper'
import { Message, MessageType } from '~/contexts/types'
import { deleteJwt } from '~/helpers/jwt'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { User } from '~/models/user'

/**
 * Dashboard page
 */
export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const addSnackbarMessage = useAddSnackbarMessage()
  const [users, setUsers] = useState<User[]>([])
  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /** Load users from the API on component mount and set the value of {@link snackbarMessage} */
  useEffect(() => {
    const usersPromise = cancelable(getUsers())
    usersPromise
      .then((data) => {
        setUsers(data)
        setSnackbarMessage({
          header: '',
          body: 'Loaded users!',
          type: MessageType.CONFIRM,
        })
      })
      .catch((err: Error) =>
        setSnackbarMessage({
          header: 'Could not load users',
          body: err.message,
          type: MessageType.ERROR,
        })
      )

    // Cancel the promise callbacks on component unmount
    return usersPromise.cancel
  }, [])

  /** Create a new snackbar if {@link snackbarMessage} has been updated */
  useEffect(() => {
    if (snackbarMessage !== null) {
      addSnackbarMessage(snackbarMessage)
    }
  }, [snackbarMessage])

  const handleLogout = (): Promise<void> =>
    logout()
      .then(() => {
        // Delete JWT cookie
        deleteJwt()
        navigate(URL.login)
      })
      .catch((err: Error) => {
        throw err // qqjf TOOD: error handling
      })

  return (
    <PageWrapper>
      <h1>Dashboard</h1>
      <ul>
        {users.map((u: User) => (
          <li key={u.username}>{u.firstName + ' ' + u.lastName}</li>
        ))}
      </ul>

      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
    </PageWrapper>
  )
}
