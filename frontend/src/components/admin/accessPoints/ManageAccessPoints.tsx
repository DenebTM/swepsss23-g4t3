import React from 'react'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

import { AdminBreadcrumbs } from '../AdminBreadcrumbs'
import { AccessPointsTable } from './AccessPointsTable'

/**
 * Access point managment page for admins
 */
export const ManageAccessPoints: React.FC = () => {
  return (
    <PageWrapper permittedRoles={[UserRole.ADMIN]}>
      <PageHeader
        left={<AdminBreadcrumbs currentPageName="Manage Access Points" />}
      />
      <AccessPointsTable />
    </PageWrapper>
  )
}
