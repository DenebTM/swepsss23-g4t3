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
import { SensorStationView, URL } from '~/common'
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
    label: 'Dashboard',
    url: URL.dashboard,
    icon: <HomeIcon />,
    childNodes: sensorStations.map((s) => ({
      label: `Greenhouse ${s.uuid}`,
      url: URL.greenhouseView(s.uuid, SensorStationView.GRAPHICAL),
      icon: (
        <Badge badgeContent={s.uuid} sx={{ color: theme.onSurfaceVariant }}>
          <LocalFloristIcon />
        </Badge>
      ),
    })),
  },
  { label: 'Getting Started', url: URL.gettingStarted, icon: <MenuBookIcon /> },
  { label: 'My Greenhouses', url: URL.myGreenhouses, icon: <YardIcon /> },
  {
    adminOnly: true,
    label: 'Admin Home',
    url: URL.adminHome,
    icon: <AdminPanelSettingsIcon />,
    childNodes: [
      { label: 'Users', url: URL.manageUsers },
      { label: 'Access Points', url: URL.manageAccessPoints },
      { label: 'Greenhouses', url: URL.manageGreenhouses },
      { label: 'Logs', url: URL.adminLogs },
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
        navigate(URL.login)
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
            <SidebarElement key={el.label} {...el} open={props.open} />
          ))}
        </List>
      )}

      <Divider sx={{ marginTop: 'auto' }} />

      <SidebarListItem
        label="Logout"
        open={props.open}
        onClick={handleLogout}
        selected={false}
      >
        <LogoutIcon />
      </SidebarListItem>
    </>
  )
}
