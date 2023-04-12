import React from 'react'

import { URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'

import { AdminBreadcrumbs } from '../AdminBreadcrumbs'

/**
 * Sensor station managment page for admins
 */
export const ManageGreenhouses: React.FC = () => {
  return (
    <PageWrapper permittedRoles={URL.manageGreenhouses.permittedRoles}>
      <PageHeader
        left={<AdminBreadcrumbs currentPageName="Manage Greenhouses" />}
      />
      Manage greenhouses
    </PageWrapper>
  )
}
