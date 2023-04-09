import React from 'react'

import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/system/Box'

import { useUserRole } from '~/hooks/user'
import { UserRole } from '~/models/user'
import { theme } from '~/styles/theme'

import { AccessDenied } from './error/AccessDenied'
import { Sidebar } from './Sidebar/Sidebar'

interface PageWrapperProps {
  /** The body of the page */
  children: React.ReactNode

  /** If hideSidebar is true then the sidebar will not be shown */
  hideSidebar?: boolean

  /** Restrict viewing the page to users with a certain role */
  requiredRoles?: UserRole[]
}

/**
 * Wrapper component with page padding.
 * Shows a loading indicator if `pending` is set to true.
 */
export const PageWrapper: React.FC<PageWrapperProps> = (props) => {
  const userRole = useUserRole()

  return (
    <Box
      sx={{
        display: 'flex',
        background: theme.background,
        minHeight: '100vh',
        flexDirection: 'row',
      }}
    >
      <CssBaseline />
      {!(props.hideSidebar ?? false) && <Sidebar />}

      <Box
        component="main"
        sx={{
          display: 'flex',
          flex: '1',
          minHeight: '100vh',
          minWidth: 0,
          padding: theme.spacing(0, 2),
          flexDirection: 'column',
        }}
      >
        {props.requiredRoles && !props.requiredRoles.includes(userRole) ? (
          <AccessDenied />
        ) : (
          props.children
        )}
      </Box>
    </Box>
  )
}
