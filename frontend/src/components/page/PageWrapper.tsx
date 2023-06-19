import React from 'react'

import CssBaseline from '@mui/material/CssBaseline'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box, { BoxTypeMap } from '@mui/system/Box'

import { useUserRole } from '~/hooks/user'
import { UserRole } from '~/models/user'

import { AccessDenied } from './error/AccessDenied'
import { Sidebar } from './Sidebar/Sidebar'

interface PageWrapperProps {
  /** The body of the page */
  children: React.ReactNode

  /** If hideSidebar is true then the sidebar will not be shown */
  hideSidebar?: boolean

  /** Restrict viewing the page to users with certain roles */
  permittedRoles: UserRole[]

  /** Optionally override styles passed to the page wrapper */
  sx?: BoxTypeMap['props']['sx']
}

/**
 * Wrapper component with page padding.
 * Shows a loading indicator if `pending` is set to true.
 */
export const PageWrapper: React.FC<PageWrapperProps> = (props) => {
  const theme = useTheme()

  const userRole = useUserRole()
  const breakSm = useMediaQuery(theme.breakpoints.up('sm'))
  const breakMd = useMediaQuery(theme.breakpoints.up('md'))
  const breakLg = useMediaQuery(theme.breakpoints.up('lg'))

  /** Determine the page sides padding in usings of `theme.spacing` */
  const getPageSidePadding = (): number => {
    if (breakLg) {
      return 8
    } else if (breakMd) {
      return 6
    } else if (breakSm) {
      return 4
    } else {
      return 1
    }
  }

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
          padding: theme.spacing(0, getPageSidePadding()),
          flexDirection: 'column',
          ...(typeof props.sx !== 'undefined' ? props.sx : {}),
        }}
      >
        {!props.permittedRoles.includes(userRole) ? (
          <AccessDenied />
        ) : (
          props.children
        )}
      </Box>
    </Box>
  )
}
