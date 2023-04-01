import React from 'react'

import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

/**
 * Page for admins to view logs
 */
export const AdminLogs: React.FC = () => {
  return <PageWrapper requiredRole={UserRole.ADMIN}>Admin logs</PageWrapper>
}
