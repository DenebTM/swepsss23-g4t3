import React from 'react'

import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

/**
 * Access point managment page for admins
 */
export const ManageAccessPoints: React.FC = () => {
  return (
    <PageWrapper requiredRole={UserRole.ADMIN}>
      Manage access points
    </PageWrapper>
  )
}
