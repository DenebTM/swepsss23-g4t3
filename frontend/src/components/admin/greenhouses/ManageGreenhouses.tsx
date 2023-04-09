import React from 'react'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

/**
 * Sensor station managment page for admins
 */
export const ManageGreenhouses: React.FC = () => {
  return (
    <PageWrapper requiredRoles={[UserRole.ADMIN]}>
      <PageHeader />
      Manage greenhouses
    </PageWrapper>
  )
}
