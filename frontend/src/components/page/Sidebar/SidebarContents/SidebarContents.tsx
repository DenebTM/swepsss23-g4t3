import { useLocation, useNavigate } from 'react-router-dom'

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import YardIcon from '@mui/icons-material/Yard'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'

import { logout } from '~/api/endpoints/login'
import { URL } from '~/common'
import { deleteJwt } from '~/helpers/jwt'
import { useIsAdmin } from '~/hooks/user'

import { SidebarListItem } from './SidebarListItem'

/** Type of a general element which will be rendered as a sidebark link */
interface SidebarElement {
  adminOnly?: boolean
  label: string
  url: string
  icon: JSX.Element
}

/** Values to render at the top of the sidebar */
const topSidebarVals: (SidebarElement & {
  childNodes?: {
    label: string
    url: string
  }[]
})[] = [
  {
    label: 'Dashboard',
    url: URL.dashboard,
    icon: <HomeIcon />,
    childNodes: [],
  },
  { label: 'Getting Started', url: URL.gettingStarted, icon: <MenuBookIcon /> },
  { label: 'My Greenhouses', url: URL.myGreenhouses, icon: <YardIcon /> },
  {
    adminOnly: true,
    label: 'Admin Home',
    url: URL.adminHome,
    icon: <AdminPanelSettingsIcon />,
    childNodes: [],
  },
]

/** Values to render at the bottom of the sidebar */
const bottomSidebarVals: (SidebarElement & {
  childNodes?: {
    label: string
    url: string
  }[]
})[] = [
  {
    label: 'Logout',
    url: URL.login, // qqjf ?
    icon: <LogoutIcon />,
  },
]

interface SidebarContentsProps {
  open: boolean
}
/**
 * Sidebar contents (list of icons and their onClick functionality)
 * Should be a direct child of Sidebar
 */
export const SidebarContents: React.FC<SidebarContentsProps> = (props) => {
  const navigate = useNavigate()
  const isAdmin = useIsAdmin()
  const { pathname } = useLocation()

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
      <List>
        {topSidebarVals.map(
          (el) =>
            isAdmin &&
            (el.adminOnly ?? true) && (
              <SidebarListItem
                key={el.label}
                label={el.label}
                open={props.open}
                onClick={() => navigate(el.url)}
                selected={pathname === el.url}
              >
                {el.icon}
              </SidebarListItem>
            )
          // qqjf add kids
        )}
      </List>
      <Divider sx={{ marginTop: 'auto' }} />
      {bottomSidebarVals.map((el) => (
        <SidebarListItem
          key={el.label}
          label={el.label}
          open={props.open}
          onClick={handleLogout}
        >
          <LogoutIcon />
        </SidebarListItem>
      ))}
    </>
  )
}
