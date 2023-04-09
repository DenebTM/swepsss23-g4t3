import React from 'react'

import Typography from '@mui/material/Typography'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'

/**
 * Page for a gardener to see all greenhouses assigned to them
 */
export const MyGreenhouses: React.FC = () => {
  return (
    <PageWrapper>
      <PageHeader
        left={
          <Typography
            variant="headlineLarge"
            color="onSurfaceVariant"
            component="h1"
          >
            My Greenhouses
          </Typography>
        }
      />
      My greenhouses
    </PageWrapper>
  )
}
