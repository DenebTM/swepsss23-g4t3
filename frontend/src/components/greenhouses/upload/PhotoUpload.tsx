import React from 'react'

import { PAGE_URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'

/**
 * Page to upload a photo for a single sensor station
 */
export const PhotoUpload: React.FC = () => {
  return (
    <PageWrapper permittedRoles={PAGE_URL.photoUpload.permittedRoles}>
      <PageHeader />
      Photo upload page
    </PageWrapper>
  )
}
