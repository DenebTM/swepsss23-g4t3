import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@mui/material/Button'

import { logout } from '~/api/endpoints/login'
import { getUsers } from '~/api/endpoints/user'
import { URL } from '~/common'
import { deleteJwt } from '~/helpers/jwt'
import { User } from '~/models/user'

/**
 * Dashboard page
 */
export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error(err))
  }, [])

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
    <div>
      <h1>Dashboard</h1>
      <ul>
        {users.map((u: User) => (
          <li key={u.username}>{u.firstName + ' ' + u.lastName}</li>
        ))}
      </ul>

      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}
