import React from 'react'

import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { PlantIcon } from '@component-lib/PlantIcon'
import { PageWrapper } from '~/components/page/PageWrapper'
import { theme } from '~/styles/theme'

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
          <Box component="div" display="flex" alignItems="center" padding={2}>
            <Typography
              variant="headlineLarge"
              align="center"
              color="onSurface"
              component="h1"
              marginRight={1}
            >
              Log in
            </Typography>
            <PlantIcon color={theme.onSurface} />
          </Box>
          <LoginForm />
        </Paper>
      </Container>
    </PageWrapper>
  )
}
