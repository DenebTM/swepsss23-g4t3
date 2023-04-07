import React from 'react'

import { Breadcrumbs } from '@component-lib/Breadcrumbs'
import { URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'

interface AdminBreadcrumbsProps {
  /** The page name to display as the final breadcrumb element */
  currentPageName: string
}

/**
 * Reusable breadcrumb componne tfor use in admin pages. Contains a single link back to the admin home page.
 */
export const AdminBreadcrumbs: React.FC<AdminBreadcrumbsProps> = (props) => {
  return (
    <PageHeader
      left={
        <Breadcrumbs
          links={[{ name: 'Admin Home', href: URL.adminHome }]}
          currentPageName={props.currentPageName}
        />
      }
    />
  )
}
