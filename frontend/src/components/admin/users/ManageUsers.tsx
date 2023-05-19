import React, { useState } from 'react'

import { PAGE_URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { User } from '~/models/user'

import { AdminBreadcrumbs } from '../AdminBreadcrumbs'
import { UsersTable } from './UsersTable'

/**
 * User management page for admins
 */
export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>()

  return (
    <PageWrapper permittedRoles={PAGE_URL.manageUsers.permittedRoles}>
      <PageHeader left={<AdminBreadcrumbs currentPageName="Manage Users" />} />
      <UsersTable setUsers={setUsers} users={users} />
    </PageWrapper>
  )
}
