import React from 'react'

import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'
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

  /** Restrict viewing the page to users with certain roles */
  permittedRoles?: UserRole[]
}

/**
 * Wrapper component with page padding.
 * Shows a loading indicator if `pending` is set to true.
 */
export const PageWrapper: React.FC<PageWrapperProps> = (props) => {
  const userRole = useUserRole()
  const breakSm = useMediaQuery(theme.breakpoints.up('sm'))
  const breakMd = useMediaQuery(theme.breakpoints.up('md'))
  const breakLg = useMediaQuery(theme.breakpoints.up('lg'))

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
      {!props.hideSidebar && <Sidebar />}

      <Box
        component="main"
        sx={{
          display: 'flex',
          flex: '1',
          minHeight: '100vh',
          minWidth: 0,
          padding: theme.spacing(
            0,
            breakLg ? 8 : breakMd ? 6 : breakSm ? 4 : 1
          ),
          flexDirection: 'column',
        }}
      >
        {props.permittedRoles &&
        userRole !== null &&
        !props.permittedRoles.includes(userRole) ? (
          <AccessDenied />
        ) : (
          props.children
        )}
      </Box>
    </Box>
  )
}
