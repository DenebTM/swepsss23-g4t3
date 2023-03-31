import React from 'react'
import { useRouteError } from 'react-router-dom'

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
      <h1>TODO: error page</h1>
      {Boolean(props.message) && <p>{props.message}</p>}
      <p>{getErrorMessage(error)}</p>
    </PageWrapper>
  )
}
