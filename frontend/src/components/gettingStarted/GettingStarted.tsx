import React from 'react'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'

/**
 * Page containing basic instructions about how to get started with the app
 */
export const GettingStarted: React.FC = () => {
  return (
    <PageWrapper>
      <PageHeader />
      Getting started
    </PageWrapper>
  )
}
