import React from 'react'

import { URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'

import { AdminBreadcrumbs } from '../AdminBreadcrumbs'

/**
 * Page for admins to view logs
 */
export const AdminLogs: React.FC = () => {
  return (
    <PageWrapper permittedRoles={URL.adminLogs.permittedRoles}>
      <PageHeader left={<AdminBreadcrumbs currentPageName="Logs" />} />
      Admin logs
    </PageWrapper>
  )
}
