import React from 'react'

import { PAGE_URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'

import { AdminBreadcrumbs } from '../AdminBreadcrumbs'
import { AccessPointsTable } from './AccessPointsTable'

/**
 * Access point managment page for admins
 */
export const ManageAccessPoints: React.FC = () => {
  return (
    <PageWrapper permittedRoles={PAGE_URL.manageAccessPoints.permittedRoles}>
      <PageHeader
        left={<AdminBreadcrumbs currentPageName="Manage Access Points" />}
      />
      <AccessPointsTable />
    </PageWrapper>
  )
}
