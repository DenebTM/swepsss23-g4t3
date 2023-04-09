import React from 'react'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

import { AdminBreadcrumbs } from '../AdminBreadcrumbs'

/**
 * Access point managment page for admins
 */
export const ManageAccessPoints: React.FC = () => {
  return (
    <PageWrapper requiredRoles={[UserRole.ADMIN]}>
      <PageHeader
        left={<AdminBreadcrumbs currentPageName="Manage Access Points" />}
      />
      Manage access points
    </PageWrapper>
  )
}
