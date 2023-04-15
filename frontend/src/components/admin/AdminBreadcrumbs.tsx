import React from 'react'

import { Breadcrumbs } from '@component-lib/Breadcrumbs'
import { PAGE_URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'

interface AdminBreadcrumbsProps {
  /** The page name to display as the final breadcrumb element */
  currentPageName: string
}

/**
 * Reusable breadcrumb component for use in admin pages. Contains a single link back to the admin home page.
 */
export const AdminBreadcrumbs: React.FC<AdminBreadcrumbsProps> = (props) => {
  return (
    <PageHeader
      left={
        <Breadcrumbs
          links={[
            {
              name: PAGE_URL.adminHome.pageTitle,
              href: PAGE_URL.adminHome.href,
            },
          ]}
          currentPageName={props.currentPageName}
        />
      }
    />
  )
}
