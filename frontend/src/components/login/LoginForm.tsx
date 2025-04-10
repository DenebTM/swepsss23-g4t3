import { AxiosResponse } from 'axios'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import LoadingButton from '@mui/lab/LoadingButton'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Box from '@mui/system/Box'

import { handleLogin } from '~/api/endpoints/login'
import { onEnterKeypress, PAGE_URL } from '~/common'
import { setJwt } from '~/helpers/jwt'
import { useAddErrorSnackbar } from '~/hooks/snackbar'
import { LoginResponse } from '~/models/login'

/**
 * Login form component
 * Takes username and password inputs and displays an error if the login fails
 */
export const LoginForm: React.FC = () => {
  const theme = useTheme()

  const navigate = useNavigate()
  const addErrorSnackbar = useAddErrorSnackbar()
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [loggingIn, setLoggingIn] = useState(false) // Disable login button during login

  /** Send a login request to the backend and handle redirect or display errors if unsuccessful. */
  const handleApiLogin = (): void => {
    if (usernameRef.current !== null && passwordRef.current !== null) {
      const username = usernameRef.current.value
      const password = passwordRef.current.value
      setLoggingIn(true)
      handleLogin(username, password)
        .then((res: AxiosResponse<LoginResponse>) => {
          // Save JWT as a cookie
          setJwt(res.data.token)
          navigate(PAGE_URL.dashboard.href)
        })
        .catch((err: Error) => {
          addErrorSnackbar(err, 'Login error')
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
        width: '100%',
      }}
      noValidate
      autoComplete="off"
    >
      <Stack spacing={2} width="100%" maxWidth={400}>
        <TextField
          required
          label="Username"
          autoComplete="username"
          inputRef={usernameRef}
          onKeyPress={onEnterKeypress(handleApiLogin)}
          fullWidth
          autoFocus
        />
        <TextField
          required
          autoComplete="current-password"
          label="Password"
          type="password"
          inputRef={passwordRef}
          onKeyPress={onEnterKeypress(handleApiLogin)}
          fullWidth
        />
        <LoadingButton
          variant="contained"
          onClick={handleApiLogin}
          fullWidth
          size="large"
          loading={loggingIn}
          loadingPosition="center"
          color="primary"
          sx={{
            '&.MuiLoadingButton-loading': {
              background: theme.primary,
            },
          }}
        >
          Log in
        </LoadingButton>
      </Stack>
    </Box>
  )
}
