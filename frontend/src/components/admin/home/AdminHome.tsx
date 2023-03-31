import React from 'react'

import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

/**
 * Admin home page. Links to all other admin pages.
 */
export const AdminHome: React.FC = () => {
  return <PageWrapper requiredRole={UserRole.ADMIN}>Admin home</PageWrapper>
}
