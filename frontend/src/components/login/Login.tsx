import React from 'react'

import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Unstable_Grid2'
import useMediaQuery from '@mui/material/useMediaQuery'

import { PAGE_URL } from '~/common'
import { PageWrapper } from '~/components/page/PageWrapper'
import { theme } from '~/styles/theme'

import { GalleryCta } from './GalleryCta'
import { LoginForm } from './LoginForm'
import { LoginHeader } from './LoginHeader'
import { LoginSidewave } from './LoginSidewave'

/**
 * Login page
 */
export const Login: React.FC = () => {
  const narrowScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <PageWrapper hideSidebar permittedRoles={PAGE_URL.login.permittedRoles}>
      <Grid container spacing={2} padding={2}>
        {!narrowScreen && (
          <Grid xs={12} md={4}>
            <LoginSidewave />
          </Grid>
        )}
        <Grid xs={12} md={8}>
          <Container maxWidth="sm" sx={{ paddingTop: 10 }} disableGutters>
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 4,
              }}
            >
              <LoginHeader />
              <LoginForm />

              <GalleryCta />
            </Paper>
          </Container>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}
