import { AxiosResponse } from 'axios'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import LoadingButton from '@mui/lab/LoadingButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Box from '@mui/system/Box'

import { handleLogin } from '~/api/login'
import { URL } from '~/common'
import { setJwt } from '~/helpers/jwt'
import { LoginResponse } from '~/models/login'

/**
 * Login form component
 * Takes username and password inputs and displays an error if the login fails
 */
export const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [loginError, setLoginError] = useState<null | string>(null)
  const [loggingIn, setLoggingIn] = useState(false) // Disable login button during login

  const resetError = (): void => setLoginError(null)

  /* Send a login request to the backend and handle redirect or display errors if unsuccessful. */
  const handleApiLogin = (): void => {
    if (usernameRef.current !== null && passwordRef.current !== null) {
      const username = usernameRef.current.value
      const password = passwordRef.current.value
      setLoggingIn(true)
      resetError()
      handleLogin(username, password)
        .then((res: AxiosResponse<LoginResponse>) => {
          // Save JWT as a cookie
          setJwt(res.data.token)
          navigate(URL.dashboard)
        })
        .catch((err: Error) => {
          setLoginError(err.message)
        })
        .finally(() => setLoggingIn(false))
    }
  }

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '80%',
      }}
      noValidate
      autoComplete="off"
    >
      <Stack spacing={2} width="100%" maxWidth={350}>
        {Boolean(loginError) && <div>TODO (ErrorBox): {loginError}</div>}

        <TextField
          required
          label="Username"
          autoComplete="username"
          inputRef={usernameRef}
          onKeyPress={(e) => e.key === 'Enter' && handleApiLogin()}
          fullWidth
        />
        <TextField
          required
          autoComplete="current-password"
          label="Password"
          type="password"
          inputRef={passwordRef}
          onKeyPress={(e) => e.key === 'Enter' && handleApiLogin()}
          fullWidth
        />
        <LoadingButton
          variant="contained"
          onClick={handleApiLogin}
          fullWidth
          size="large"
          loading={loggingIn}
          loadingPosition="center"
        >
          Log in
        </LoadingButton>
      </Stack>
    </Box>
  )
}
