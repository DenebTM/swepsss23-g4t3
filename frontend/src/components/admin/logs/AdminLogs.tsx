import React from 'react'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

import { AdminBreadcrumbs } from '../AdminBreadcrumbs'

/**
 * Page for admins to view logs
 */
export const AdminLogs: React.FC = () => {
  return (
    <PageWrapper permittedRoles={[UserRole.ADMIN]}>
      <PageHeader left={<AdminBreadcrumbs currentPageName="Logs" />} />
      Admin logs
    </PageWrapper>
  )
}
