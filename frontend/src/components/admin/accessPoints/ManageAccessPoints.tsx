import React from 'react'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

/**
 * Access point managment page for admins
 */
export const ManageAccessPoints: React.FC = () => {
  return (
    <PageWrapper requiredRole={UserRole.ADMIN}>
      <PageHeader />
      Manage access points
    </PageWrapper>
  )
}
