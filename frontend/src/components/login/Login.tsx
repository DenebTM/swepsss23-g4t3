import React from 'react'

import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import { PageWrapper } from '~/components/page/PageWrapper'

import { LoginForm } from './LoginForm'

/**
 * Login page
 */
export const Login: React.FC = () => {
  return (
    <PageWrapper hideSidebar>
      <Container maxWidth="sm" sx={{ paddingTop: 10 }} disableGutters>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            color="textSecondary"
            gutterBottom
          >
            Log in
          </Typography>
          <LoginForm />
        </Paper>
      </Container>
    </PageWrapper>
  )
}
