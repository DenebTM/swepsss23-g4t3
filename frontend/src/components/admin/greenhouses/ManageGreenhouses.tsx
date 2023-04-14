import React from 'react'

import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { UserRole } from '~/models/user'

import { AdminBreadcrumbs } from '../AdminBreadcrumbs'
import { SensorStationsTable } from './SensorStationsTable/SensorStationsTable'

/**
 * Sensor station managment page for admins
 */
export const ManageGreenhouses: React.FC = () => {
  return (
    <PageWrapper permittedRoles={[UserRole.ADMIN]}>
      <PageHeader
        left={<AdminBreadcrumbs currentPageName="Manage Greenhouses" />}
      />
      <SensorStationsTable />
    </PageWrapper>
  )
}
