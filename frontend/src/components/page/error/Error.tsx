import React from 'react'
import { useNavigate, useRouteError } from 'react-router-dom'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import { PAGE_URL } from '~/common'
import { PageWrapper } from '~/components/page/PageWrapper'
import { isUserLoggedIn } from '~/helpers/jwt'
import { theme } from '~/styles/theme'

/**
 * If `messageOverride` is specified then return this, otherwise extracts a string
 * error message from the `err` object.
 */
const getErrorMessage = (
  err: unknown,
  messageOverridde: string | undefined
): string => {
  if (typeof messageOverridde !== 'undefined') {
    return messageOverridde
  }

  if (typeof err == 'undefined') {
    return ''
  }

  // Check that the object is in the expected format, then extract the status and message
  if (
    typeof err === 'object' &&
    err &&
    'error' in err &&
    typeof err.error === 'object' &&
    err.error &&
    'message' in err.error &&
    typeof err.error.message === 'string'
  ) {
    return err.error.message
  }

  // Fallback if a message can not be extracted from the err object
  return String(err)
}

/** Try to get a status code from an err object of unknown type */
const getErrorStatus = (err: unknown): number | undefined => {
  // Check that the object is in the expected format, then extract the status and message
  if (
    typeof err === 'object' &&
    err &&
    'status' in err &&
    typeof err.status === 'number'
  ) {
    return err.status
  }
}

interface ErrorProps {
  message?: string
}

/**
 * Fallback error page to show if React fails to render a given component.
 * If message is specified via `props.message`, then displays message rather than errors caught by `useRouteError`.
 */
export const Error: React.FC<ErrorProps> = (props) => {
  const error = useRouteError()
  const navigate = useNavigate()

  /** Navigate to the Dashboard if the user is logged in, and the login page otherwise */
  const handleNavigateClick = (): void => {
    if (isUserLoggedIn()) {
      navigate(PAGE_URL.dashboard.href)
    } else {
      navigate(PAGE_URL.login.href)
    }
  }

  return (
    <PageWrapper hideSidebar permittedRoles={PAGE_URL.error.permittedRoles}>
      <Container
        maxWidth="md"
        sx={{ padding: theme.spacing(6, 0, 2), textAlign: 'center' }}
      >
        <Typography
          variant="displaySmall"
          color="onSurfaceVariant"
          component="h1"
          sx={{ marginBottom: 3 }}
        >
          Something went wrong 😢
        </Typography>

        <Typography variant="headlineSmall" color="onSurface" component="p">
          {getErrorStatus(error)}
        </Typography>

        <Typography variant="bodyLarge" color="onSurface" component="p">
          {getErrorMessage(error, props.message)}
        </Typography>

        <Button
          variant="contained"
          onClick={handleNavigateClick}
          sx={{ marginTop: 5 }}
        >
          Return to {isUserLoggedIn() ? ' Dashboard' : ' login page'}
        </Button>
      </Container>
    </PageWrapper>
  )
}
