import React from 'react'

import { PAGE_URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'

import { AdminBreadcrumbs } from '../AdminBreadcrumbs'
import { AdminLogsTable } from './AdminLogsTable'

/**
 * Page for admins to view logs
 */
export const AdminLogs: React.FC = () => {
  return (
    <PageWrapper permittedRoles={PAGE_URL.adminLogs.permittedRoles}>
      <PageHeader left={<AdminBreadcrumbs currentPageName="Logs" />} />
      <AdminLogsTable />
    </PageWrapper>
  )
}
