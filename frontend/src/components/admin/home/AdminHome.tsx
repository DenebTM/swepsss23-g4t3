import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AddIcon from '@mui/icons-material/Add'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import TocOutlinedIcon from '@mui/icons-material/TocOutlined'
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined'
import { SvgIconTypeMap } from '@mui/material/SvgIcon'
import Grid from '@mui/material/Unstable_Grid2'

import {
  ADD_GREENHOUSE_DESCRIPTION,
  ADD_GREENHOUSE_TEXT,
  PAGE_URL,
} from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageTitle } from '~/components/page/PageTitle'
import { PageWrapper } from '~/components/page/PageWrapper'

import { AddSensorStationDialog } from '../AddSensorStationDialog/AddSensorStationDialog'
import { AdminHomeButton, AdminHomeButtonProps } from './AdminHomeButton'

const iconFontSize: SvgIconTypeMap['props']['fontSize'] = 'large'

/**
 * Admin home page. Links to all other admin pages.
 */
export const AdminHome: React.FC = () => {
  const navigate = useNavigate()
  const [addSsDialogOpen, setAddSsDialogOpen] = useState(false)

  /** Handle closing the dialog to add a sensor station */
  const handleCloseSsDialog = () => {
    setAddSsDialogOpen(false)
    // qqjf TODO trigger reload
  }

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
      title: ADD_GREENHOUSE_TEXT,
      description: ADD_GREENHOUSE_DESCRIPTION,
      icon: <AddIcon fontSize={iconFontSize} />,
      onClick: () => setAddSsDialogOpen(true),
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
      <AddSensorStationDialog
        open={addSsDialogOpen}
        onClose={handleCloseSsDialog}
      />
    </PageWrapper>
  )
}
