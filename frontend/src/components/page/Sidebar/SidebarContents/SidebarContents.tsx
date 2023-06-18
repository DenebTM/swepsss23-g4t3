import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import HomeIcon from '@mui/icons-material/Home'
import ColorModeIcon from '@mui/icons-material/LightMode'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import Badge from '@mui/material/Badge'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'

import { logout } from '~/api/endpoints/login'
import { GreenhouseIcon, PAGE_URL, SensorStationView } from '~/common'
import { ColorModeContext } from '~/contexts/ColorModeContext/ColorModeContext'
import { deleteJwt, isUserLoggedIn } from '~/helpers/jwt'
import { useSensorStations } from '~/hooks/appContext'
import { SensorStation } from '~/models/sensorStation'

import { SidebarElement, SidebarElementWithChildren } from './SidebarElement'
import { SidebarListItem } from './SidebarListItem'

/** Sidebar elements to render at the top of the sidebar */
const topSidebarVals = (
  isUserLoggedIn: boolean,
  sensorStations: SensorStation[]
): SidebarElementWithChildren[] => [
  {
    ...PAGE_URL.dashboard,
    icon: <HomeIcon />,
    childNodes: sensorStations.map((s) => ({
      pageTitle: PAGE_URL.greenhouseView.pageTitle(s.ssID),
      href: PAGE_URL.greenhouseView.href(
        s.ssID,
        isUserLoggedIn ? SensorStationView.GRAPHICAL : SensorStationView.GALLERY
      ),
      icon: (
        <Badge badgeContent={String(s.ssID)}>
          <LocalFloristIcon />
        </Badge>
      ),
    })),
  },
  {
    ...PAGE_URL.gettingStarted,
    icon: <MenuBookIcon />,
  },
  {
    ...PAGE_URL.myGreenhouses,
    icon: <GreenhouseIcon />,
  },
  {
    ...PAGE_URL.adminHome,
    icon: <AdminPanelSettingsIcon />,
    childNodes: [
      PAGE_URL.manageUsers,
      PAGE_URL.manageAccessPoints,
      PAGE_URL.manageGreenhouses,
      PAGE_URL.adminLogs,
    ],
  },
]

interface SidebarContentsProps {
  open: boolean
}

/**
 * Sidebar contents (list of icons and their onClick functionality)
 * Should be a direct child of `Sidebar`.
 */
export const SidebarContents: React.FC<SidebarContentsProps> = (props) => {
  const navigate = useNavigate()
  const sensorStations = useSensorStations(true)

  const handleLogout = (): Promise<void> =>
    logout()
      .then(() => {
        // Delete JWT cookie
        deleteJwt()
        navigate(PAGE_URL.login.href)
      })
      .catch((err: Error) => {
        throw err
      })

  const colorModeContext = useContext(ColorModeContext)
  const handleChangeColorMode = (): void => {
    colorModeContext.changeColorMode()
  }

  return (
    <>
      <Divider sx={{ borderColor: 'transparent' }} />
      {sensorStations && (
        <List>
          {topSidebarVals(isUserLoggedIn(), sensorStations).map((el) => (
            <SidebarElement key={el.pageTitle} {...el} open={props.open} />
          ))}
        </List>
      )}

      <Divider
        sx={{
          marginTop: 'auto',
          borderColor: 'transparent',
        }}
      />

      {/* Color mode button */}
      <SidebarListItem
        label={'Theme: ' + colorModeContext.activeMode.toUpperCase()}
        open={props.open}
        onClick={handleChangeColorMode}
      >
        <ColorModeIcon />
      </SidebarListItem>

      {/* Logout button */}
      <SidebarListItem
        label={isUserLoggedIn() ? 'Logout' : PAGE_URL.login.pageTitle}
        open={props.open}
        onClick={handleLogout}
      >
        <LogoutIcon />
      </SidebarListItem>
    </>
  )
}
