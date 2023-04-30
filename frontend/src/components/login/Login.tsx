import React from 'react'

import Paper from '@mui/material/Paper'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/system/Box'

import { PAGE_URL } from '~/common'
import { PageWrapper } from '~/components/page/PageWrapper'
import { theme } from '~/styles/theme'

import { GalleryCta } from './GalleryCta'
import { LoginForm } from './LoginForm'
import { LoginHeader } from './LoginHeader'
import { LoginSidewave } from './LoginSidewave'

const loginSidewaveWidth = '36%'

/**
 * Login page
 */
export const Login: React.FC = () => {
  const breakpointDownMd = useMediaQuery(theme.breakpoints.down('md'))
  const breakpointDownSm = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <PageWrapper
      hideSidebar
      permittedRoles={PAGE_URL.login.permittedRoles}
      sx={{ padding: 0, flexDirection: 'row' }}
    >
      {!breakpointDownMd && (
        <Box
          sx={{
            position: 'fixed',
            width: loginSidewaveWidth,
          }}
        >
          <LoginSidewave />
        </Box>
      )}
      <Box
        sx={{
          padding: theme.spacing(2, 3, 8),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: breakpointDownMd
            ? '100%'
            : `calc(100% - ${loginSidewaveWidth})`,
          left: breakpointDownMd ? 0 : loginSidewaveWidth,
        }}
      >
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: 'fit-content',
            padding: breakpointDownSm
              ? theme.spacing(3, 5)
              : theme.spacing(4, 8),
            width: '90%',
            maxWidth: '600px',
          }}
        >
          <LoginHeader
            padding={
              breakpointDownSm ? theme.spacing(3, 1.5) : theme.spacing(4, 3)
            }
          />
          <LoginForm />
          <GalleryCta />
        </Paper>
      </Box>
    </PageWrapper>
  )
}
