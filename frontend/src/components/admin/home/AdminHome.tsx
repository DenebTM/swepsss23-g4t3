import React from 'react'
import { useNavigate } from 'react-router-dom'

import AddIcon from '@mui/icons-material/Add'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import TocOutlinedIcon from '@mui/icons-material/TocOutlined'
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined'
import { SvgIconTypeMap } from '@mui/material/SvgIcon'
import Grid from '@mui/material/Unstable_Grid2'

import { URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { UserRole } from '~/models/user'

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
      onClick: () => navigate(URL.manageUsers),
    },
    {
      title: 'Manage Access Points',
      description: 'Add and remove access points',
      icon: <WifiOutlinedIcon fontSize={iconFontSize} />,
      onClick: () => navigate(URL.manageAccessPoints),
    },
    {
      title: 'Audit Log',
      description: 'View filterable logs for events and errors',
      icon: <TocOutlinedIcon fontSize={iconFontSize} />,
      onClick: () => navigate(URL.adminLogs),
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
      onClick: () => navigate(URL.manageGreenhouses),
    },
  ]

  return (
    <PageWrapper requiredRole={UserRole.ADMIN}>
      <PageHeader left="Admin Home" />
      <Grid container spacing={2} padding={2}>
        {adminHomeLinks.map((link) => (
          <Grid xs={12} sm={6} md={4}>
            <AdminHomeButton {...link} />
          </Grid>
        ))}
      </Grid>
    </PageWrapper>
  )
}
