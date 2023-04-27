import React from 'react'
import { useNavigate } from 'react-router-dom'

import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import MuiBreadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import { theme } from '~/styles/theme'

export interface BreadcrumbLink {
  disabled?: boolean
  /** The URL to navigate to on click */
  href: string
  /** The name to display for the breadcrumb link. Should be unique within the list of links in order to use it as a key. */
  name: string
}

interface BreadcrumbsProps {
  /** Ordered list of links higher in the hierarchy than the current page */
  links: BreadcrumbLink[]
  /** The current page name (will not be hypgerlinked) */
  currentPageName: string
}

/**
 * Custom breadcrumbs component to show the user where they are in the page hierarchy
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  const navigate = useNavigate()

  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumbs"
      color={theme.outline}
    >
      {props.links.map((link: BreadcrumbLink) => (
        <Link
          underline={link.disabled ? 'none' : 'hover'}
          key={link.name}
          color="inherit"
          onClick={() => {
            if (!link.disabled) {
              navigate(link.href)
            }
          }}
          sx={{ cursor: link.disabled ? 'default' : 'pointer' }}
        >
          {link.name}
        </Link>
      ))}
      <Typography color={theme.onSurfaceVariant}>
        {props.currentPageName}
      </Typography>
    </MuiBreadcrumbs>
  )
}
