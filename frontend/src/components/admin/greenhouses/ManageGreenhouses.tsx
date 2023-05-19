import React from 'react'

import { PAGE_URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'

import { AdminBreadcrumbs } from '../AdminBreadcrumbs'
import { SensorStationsTable } from './SensorStationsTable/SensorStationsTable'

/**
 * Sensor station management page for admins
 */
export const ManageGreenhouses: React.FC = () => {
  return (
    <PageWrapper permittedRoles={PAGE_URL.manageGreenhouses.permittedRoles}>
      <PageHeader
        left={<AdminBreadcrumbs currentPageName="Manage Greenhouses" />}
      />
      <SensorStationsTable />
    </PageWrapper>
  )
}
