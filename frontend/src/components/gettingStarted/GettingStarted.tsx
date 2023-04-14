import React from 'react'

import { PAGE_URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'

import { PageTitle } from '../page/PageTitle'

/**
 * Page containing basic instructions about how to get started with the app
 */
export const GettingStarted: React.FC = () => {
  return (
    <PageWrapper>
      <PageHeader
        left={<PageTitle>{PAGE_URL.gettingStarted.pageTitle}</PageTitle>}
      />
      To add
    </PageWrapper>
  )
}
