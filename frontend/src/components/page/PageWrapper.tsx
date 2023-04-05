import React from 'react'

import LinearProgress from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'

import { useUserRole } from '~/hooks/user'
import { UserRole } from '~/models/user'
import { sidebarWidth } from '~/styles/theme'

import { AccessDenied } from './error/AccessDenied'
import { Sidebar } from './Sidebar/Sidebar'

const WrapperDiv = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  overflow: 'auto',
  margin: '0 auto',
  flexDirection: 'column',
  width: `calc(100vw - ${sidebarWidth})`,
})

interface PageWrapperProps {
  /** The body of the page */
  children: React.ReactNode

  /** If hideSidebar is true then the sidebar will not be shown */
  hideSidebar?: boolean

  /** Whether to show a loading indicatior at the top of the page */
  pending?: boolean

  /** Restrict viewing the page to users with a certain role */
  requiredRole?: UserRole
}

/**
 * Wrapper component with page padding.
 * Shows a loading indicator if `pending` is set to true.
 */
export const PageWrapper: React.FC<PageWrapperProps> = (props) => {
  const userRole = useUserRole()

  let PageContents = (
    <WrapperDiv>
      {props.requiredRole && userRole !== props.requiredRole ? (
        <AccessDenied />
      ) : (
        <>
          {Boolean(props.pending) && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
              <LinearProgress sx={{ height: 4.5 }} />
            </div>
          )}
          {props.children}
        </>
      )}
    </WrapperDiv>
  )

  // Show sidebar wrapper only if `props.hideSidebar` is true
  if (!(props.hideSidebar ?? false)) {
    PageContents = <Sidebar>{PageContents}</Sidebar>
  }

  return PageContents
}
