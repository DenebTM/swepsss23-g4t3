import React from 'react'
import { useRouteError } from 'react-router-dom'

import Typography from '@mui/material/Typography'

import { URL } from '~/common'
import { PageWrapper } from '~/components/page/PageWrapper'

interface ErrorProps {
  message?: string
}
/**
 * Fallback error page to show if React fails to render a given component.
 * If message is specified, then displays message before any errors caught by `useRouteError`.
 */
export const Error: React.FC<ErrorProps> = (props) => {
  const error = useRouteError()

  const getErrorMessage = (err: unknown): string => {
    // Only return props.message if no other error can be deduced
    if (typeof err == 'undefined') {
      return ''
    }

    if (typeof error === 'object' && error && 'data' in error) {
      // Get message from e.g. a router 404 response for a page
      if (typeof error.data === 'string') {
        return error.data
      }
    }
    return String(err)
  }

  return (
    <PageWrapper hideSidebar>
      <Typography variant="headlineLarge" color="onSurface" component="h1">
        {URL.error.pageTitle}
      </Typography>

      {Boolean(props.message) && (
        <Typography
          variant="headlineSmall"
          color="onSurfaceVariant"
          component="h2"
        >
          {props.message}
        </Typography>
      )}

      <Typography variant="bodyLarge" color="onSurfaceVariant" component="p">
        {getErrorMessage(error)}
      </Typography>
    </PageWrapper>
  )
}
