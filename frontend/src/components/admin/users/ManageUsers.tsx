import React from 'react'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

import { AdminBreadcrumbs } from '../AdminBreadcrumbs'

/**
 * User managment page for admins
 */
export const ManageUsers: React.FC = () => {
  return (
    <PageWrapper requiredRole={UserRole.ADMIN}>
      <PageHeader left={<AdminBreadcrumbs currentPageName="Manage Users" />} />
      Manage users
    </PageWrapper>
  )
}
