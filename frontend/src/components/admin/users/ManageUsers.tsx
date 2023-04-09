import React from 'react'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

/**
 * User managment page for admins
 */
export const ManageUsers: React.FC = () => {
  return (
    <PageWrapper requiredRoles={[UserRole.ADMIN]}>
      <PageHeader />
      Manage users
    </PageWrapper>
  )
}
