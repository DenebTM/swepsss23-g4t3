import React, { useState } from 'react'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { User, UserRole } from '~/models/user'

import { UsersTable } from './UsersTable'

import { AdminBreadcrumbs } from '../AdminBreadcrumbs'

/**
 * User managment page for admins
 */
export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>()

  return (
    <PageWrapper requiredRole={UserRole.ADMIN}>
      <PageHeader left={<AdminBreadcrumbs currentPageName="Manage Users" />} />
      Manage users
      <UsersTable setUsers={setUsers} users={users} />
    </PageWrapper>
  )
}
