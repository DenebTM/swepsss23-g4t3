import { useContext } from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { PlantIcon } from '@component-lib/icons/PlantIcon'
import { Tooltip } from '@component-lib/Tooltip'
import { AppContext } from '~/contexts/AppContext/AppContext'

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
  const theme = useTheme()

  const { appState, setSidebarOpen } = useContext(AppContext)

  const toggleDrawerOpen = (): void => {
    setSidebarOpen(!appState.sidebarOpen)
  }

  return (
    <CustomDrawer open={appState.sidebarOpen}>
      <DrawerHeader
        sx={{
          justifyContent: appState.sidebarOpen ? 'space-between' : 'center',
          color: theme.outline,
          padding: theme.spacing(2, 0, 1),
        }}
      >
        {appState.sidebarOpen && (
          <Box
            component="div"
            display="flex"
            alignItems="center"
            paddingLeft={1}
          >
            <Typography
              variant="titleMedium"
              color="inherit"
              align="center"
              sx={{
                marginRight: '1px',
              }}
            >
              PlantHealth
            </Typography>
            <PlantIcon color={theme.outline} height={theme.spacing(2)} />
          </Box>
        )}
        <Tooltip
          title={appState.sidebarOpen ? 'Hide sidebar' : 'Expand sidebar'}
          arrow
        >
          <IconButton onClick={toggleDrawerOpen} sx={{ color: 'inherit' }}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </DrawerHeader>
      <SidebarContents open={appState.sidebarOpen} />
    </CustomDrawer>
  )
}
