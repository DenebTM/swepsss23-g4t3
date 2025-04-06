import React from 'react'

import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import { PAGE_URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'

import { PageTitle } from '../page/PageTitle'
import { GettingStartedPageContents } from './GettingStartedPageContents'

/**
 * Page containing basic instructions about how to get started with the app
 */
export const GettingStarted: React.FC = () => {
  return (
    <PageWrapper permittedRoles={PAGE_URL.gettingStarted.permittedRoles}>
      <PageHeader
        left={<PageTitle>{PAGE_URL.gettingStarted.pageTitle}</PageTitle>}
      />

      <Typography color="outlineVariant" variant="bodySmall" gutterBottom>
        <b>Note:</b> this guide assumes that all devices are already set up with
        the necessary dependencies/project files/firmware/wiring/etc.
      </Typography>
      <Typography color="outlineVariant" variant="bodySmall">
        For additional information, please refer to the project{' '}
        <Link href="https://github.com/DenebTM/swepsss23-g4t3/wiki">
          wiki
        </Link>{' '}
        and{' '}
        <Link href="https://github.com/DenebTM/swepsss23-g4t3/blob/main/README.md">
          README
        </Link>
        .
      </Typography>

      <GettingStartedPageContents />
    </PageWrapper>
  )
}
