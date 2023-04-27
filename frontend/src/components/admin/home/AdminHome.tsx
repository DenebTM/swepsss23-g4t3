import React from 'react'
import { useNavigate } from 'react-router-dom'

import AddIcon from '@mui/icons-material/Add'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import TocOutlinedIcon from '@mui/icons-material/TocOutlined'
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined'
import { SvgIconTypeMap } from '@mui/material/SvgIcon'
import Grid from '@mui/material/Unstable_Grid2'

import { PAGE_URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageTitle } from '~/components/page/PageTitle'
import { PageWrapper } from '~/components/page/PageWrapper'
import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'

import { AdminHomeButton, AdminHomeButtonProps } from './AdminHomeButton'

const iconFontSize: SvgIconTypeMap['props']['fontSize'] = 'large'

/**
 * Admin home page. Links to all other admin pages.
 */
export const AdminHome: React.FC = () => {
  const navigate = useNavigate()
  const addSnackbarMessage = useAddSnackbarMessage()

  const adminHomeLinks: AdminHomeButtonProps[] = [
    {
      title: 'Manage Users',
      description: 'Edit and delete users',
      icon: <PersonOutlineOutlinedIcon fontSize={iconFontSize} />,
      onClick: () => navigate(PAGE_URL.manageUsers.href),
    },
    {
      title: 'Manage Access Points',
      description: 'Add and remove access points',
      icon: <WifiOutlinedIcon fontSize={iconFontSize} />,
      onClick: () => navigate(PAGE_URL.manageAccessPoints.href),
    },
    {
      title: 'Audit Log',
      description: 'View filterable logs for events and errors',
      icon: <TocOutlinedIcon fontSize={iconFontSize} />,
      onClick: () => navigate(PAGE_URL.adminLogs.href),
    },
    {
      title: 'Add Greenhouses',
      description: 'Connect a new greenhouse',
      icon: <AddIcon fontSize={iconFontSize} />,
      onClick: () =>
        addSnackbarMessage({
          header: 'Not Implemented',
          body: 'Adding greenhouses has not been implemented yet.',
          type: MessageType.ERROR,
        }),
    },
    {
      title: 'Manage Greenhouses',
      description: 'Print QR codes and assign gardeners to greenhouses',
      icon: <HomeOutlinedIcon fontSize={iconFontSize} />,
      onClick: () => navigate(PAGE_URL.manageGreenhouses.href),
    },
  ]

  return (
    <PageWrapper permittedRoles={PAGE_URL.adminHome.permittedRoles}>
      <PageHeader
        left={<PageTitle>{PAGE_URL.adminHome.pageTitle}</PageTitle>}
      />
      <Grid container spacing={2} padding={2}>
        {adminHomeLinks.map((link) => (
          <Grid xs={12} sm={6} md={4} key={link.title}>
            <AdminHomeButton {...link} />
          </Grid>
        ))}
      </Grid>
    </PageWrapper>
  )
}
