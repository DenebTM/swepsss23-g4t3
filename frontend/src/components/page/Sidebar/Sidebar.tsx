import { useState } from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Box from '@mui/system/Box'

import { CustomDrawer } from './CustomDrawer'
import { SidebarContents } from './SidebarContents/SidebarContents'

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

interface SidebarProps {
  children: React.ReactNode
}
/**
 * Collapsible sidebar component
 */
export const Sidebar: React.FC<SidebarProps> = (props) => {
  const [open, setOpen] = useState(true)

  const toggleDrawerOpen = (): void => {
    setOpen((oldOpen) => !oldOpen)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <CustomDrawer open={open}>
        <DrawerHeader sx={{ justifyContent: open ? 'flex-end' : 'center' }}>
          <IconButton onClick={toggleDrawerOpen} color="inherit">
            <MenuIcon />
          </IconButton>
        </DrawerHeader>
        <SidebarContents open={open} />
      </CustomDrawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {props.children}
      </Box>
    </Box>
  )
}
