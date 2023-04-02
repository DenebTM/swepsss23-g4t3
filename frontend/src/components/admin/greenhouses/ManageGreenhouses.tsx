import React from 'react'

import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

/**
 * Sensor station managment page for admins
 */
export const ManageGreenhouses: React.FC = () => {
  return (
    <PageWrapper requiredRole={UserRole.ADMIN}>Manage greenhouses</PageWrapper>
  )
}
