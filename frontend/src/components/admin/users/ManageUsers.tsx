import React, { useState } from 'react'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { User, UserRole } from '~/models/user'

import { UsersTable } from './UsersTable'

/**
 * User managment page for admins
 */
export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>()

  return (
    <PageWrapper requiredRole={UserRole.ADMIN}>
      <PageHeader />
      Manage users
      <UsersTable setUsers={setUsers} users={users} />
    </PageWrapper>
  )
}
