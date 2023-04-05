import React from 'react'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

/**
 * Page for admins to view logs
 */
export const AdminLogs: React.FC = () => {
  return (
    <PageWrapper requiredRole={UserRole.ADMIN}>
      <PageHeader />
      Admin logs
    </PageWrapper>
  )
}
