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
        <Link href="https://git.uibk.ac.at/informatik/qe/swess23/group4/g4t3/-/wikis/home">
          wiki
        </Link>{' '}
        and{' '}
        <Link href="https://git.uibk.ac.at/informatik/qe/swess23/group4/g4t3/-/blob/690e66b84beca72c807af26bdeec6f2d37fd7929/README.md">
          README
        </Link>
        .
      </Typography>

      <GettingStartedPageContents />
    </PageWrapper>
  )
}
