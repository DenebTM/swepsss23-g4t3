import React from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@mui/material/Button'

import { logout } from '~/api/login'
import { URL } from '~/common'
import { deleteJwt } from '~/helpers/jwt'

/**
 * Dashboard page
 */
export const Dashboard: React.FC = () => {
  const navigate = useNavigate()

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

      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}
