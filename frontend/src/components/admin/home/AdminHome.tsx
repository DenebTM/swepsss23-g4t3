import React from 'react'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

/**
 * Admin home page. Links to all other admin pages.
 */
export const AdminHome: React.FC = () => {
  return (
    <PageWrapper requiredRole={UserRole.ADMIN}>
      <PageHeader />
      Admin home
    </PageWrapper>
  )
}
