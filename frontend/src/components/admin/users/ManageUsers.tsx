import React from 'react'

import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

/**
 * User managment page for admins
 */
export const ManageUsers: React.FC = () => {
  return <PageWrapper requiredRole={UserRole.ADMIN}>Manage users</PageWrapper>
}
