import { useNavigate } from 'react-router-dom'

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import HomeIcon from '@mui/icons-material/Home'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import YardIcon from '@mui/icons-material/Yard'
import Badge from '@mui/material/Badge'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'

import { logout } from '~/api/endpoints/login'
import { PAGE_URL, SensorStationView } from '~/common'
import { deleteJwt } from '~/helpers/jwt'
import { useSensorStations } from '~/hooks/appContext'
import { SensorStation } from '~/models/sensorStation'
import { theme } from '~/styles/theme'

import { SidebarElement, SidebarElementWithChildren } from './SidebarElement'
import { SidebarListItem } from './SidebarListItem'

/** Sidebar elements to render at the top of the sidebar */
const topSidebarVals = (
  sensorStations: SensorStation[]
): SidebarElementWithChildren[] => [
  {
    ...PAGE_URL.dashboard,
    icon: <HomeIcon />,
    childNodes: sensorStations.map((s) => ({
      pageTitle: PAGE_URL.greenhouseView.pageTitle(s.uuid),
      href: PAGE_URL.greenhouseView.href(s.uuid, SensorStationView.GRAPHICAL),
      icon: (
        <Badge badgeContent={s.uuid} sx={{ color: theme.onSurfaceVariant }}>
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
    icon: <YardIcon />,
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
  const sensorStations = useSensorStations()

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

  return (
    <>
      <Divider />
      {sensorStations && (
        <List>
          {topSidebarVals(sensorStations).map((el) => (
            <SidebarElement key={el.pageTitle} {...el} open={props.open} />
          ))}
        </List>
      )}

      <Divider sx={{ marginTop: 'auto' }} />

      <SidebarListItem label="Logout" open={props.open} onClick={handleLogout}>
        <LogoutIcon />
      </SidebarListItem>
    </>
  )
}
