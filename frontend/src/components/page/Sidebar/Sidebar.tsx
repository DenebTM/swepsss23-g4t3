import { useContext } from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

import { AppContext } from '~/contexts/AppContext/AppContext'
import { theme } from '~/styles/theme'

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

/**
 * Collapsible sidebar component. Renders {@link CustomDrawer} and manages open state.
 */
export const Sidebar: React.FC = () => {
  const { appState, setSidebarOpen } = useContext(AppContext)

  const toggleDrawerOpen = (): void => {
    setSidebarOpen(!appState.sidebarOpen)
  }

  return (
    <CustomDrawer open={appState.sidebarOpen}>
      <DrawerHeader
        sx={{
          justifyContent: appState.sidebarOpen ? 'flex-end' : 'center',
        }}
      >
        <IconButton onClick={toggleDrawerOpen} sx={{ color: theme.outline }}>
          <MenuIcon />
        </IconButton>
      </DrawerHeader>
      <SidebarContents open={appState.sidebarOpen} />
    </CustomDrawer>
  )
}
