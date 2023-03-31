import { cancelable } from 'cancelable-promise'
import React, { useEffect, useState } from 'react'

import { getUsers } from '~/api/endpoints/user'
import { PageWrapper } from '~/components/page/PageWrapper'
import { Message, MessageType } from '~/contexts/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { User } from '~/models/user'

/**
 * Dashboard page
 */
export const Dashboard: React.FC = () => {
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

  return (
    <PageWrapper>
      <h1>Dashboard</h1>
      <ul>
        {users.map((u: User) => (
          <li key={u.username}>{u.firstName + ' ' + u.lastName}</li>
        ))}
      </ul>
    </PageWrapper>
  )
}
