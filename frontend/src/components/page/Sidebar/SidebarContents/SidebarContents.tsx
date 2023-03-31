import { cancelable } from 'cancelable-promise'
import { Fragment, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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
import { getSensorStations } from '~/api/endpoints/sensorStations'
import { SensorStationView, URL } from '~/common'
import { Message, MessageType } from '~/contexts/types'
import { deleteJwt } from '~/helpers/jwt'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { useIsAdmin } from '~/hooks/user'
import { SensorStation } from '~/models/sensorStation'
import { sidebarIconColour } from '~/styles/theme'

import { SidebarListItem } from './SidebarListItem'

/** Type of a general element which will be rendered as a sidebark link */
interface SidebarElement {
  adminOnly?: boolean
  label: string
  url: string
  icon?: JSX.Element
}

/** Values to render at the top of the sidebar */
const topSidebarVals = (
  sensorStations: SensorStation[]
): (SidebarElement & {
  childNodes?: SidebarElement[]
})[] => [
  {
    label: 'Dashboard',
    url: URL.dashboard,
    icon: <HomeIcon />,
    childNodes: sensorStations.map((s) => ({
      label: `Greenhouse ${s.id}`,
      url: URL.greenhouseView(s.id, SensorStationView.GRAPHICAL),
      icon: (
        <Badge badgeContent={s.id} sx={{ color: sidebarIconColour }}>
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
 * Should be a direct child of Sidebar
 */
export const SidebarContents: React.FC<SidebarContentsProps> = (props) => {
  const navigate = useNavigate()
  const isAdmin = useIsAdmin()
  const addSnackbarMessage = useAddSnackbarMessage()
  const { pathname } = useLocation()
  const [sensorStations, setSensorStations] = useState<SensorStation[]>()
  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /**
   * Load users from the API on component mount and set the value of {@link snackbarMessage}.
   * qqjf should be lifted into Context.
   */
  useEffect(() => {
    const ssPromise = cancelable(getSensorStations())
    ssPromise
      .then((data) => {
        setSensorStations(data)
      })
      .catch((err: Error) =>
        setSnackbarMessage({
          header: 'Could not load greenhouses',
          body: err.message,
          type: MessageType.ERROR,
        })
      )

    // Cancel the promise callbacks on component unmount
    return ssPromise.cancel
  }, [])

  /** Create a new snackbar if {@link snackbarMessage} has been updated */
  useEffect(() => {
    if (snackbarMessage !== null) {
      addSnackbarMessage(snackbarMessage)
    }
  }, [snackbarMessage])

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
      {typeof sensorStations !== 'undefined' && (
        <List>
          {topSidebarVals(sensorStations).map(
            (el) =>
              isAdmin &&
              (el.adminOnly ?? true) && (
                <Fragment key={el.label}>
                  <SidebarListItem
                    label={el.label}
                    open={props.open}
                    onClick={() => navigate(el.url)}
                    selected={pathname === el.url}
                  >
                    {el.icon}
                  </SidebarListItem>
                  {el.childNodes &&
                    el.childNodes.map(
                      (child) =>
                        /** Render child elements in the sidebar only if open or if the child has an icon defined*/
                        (props.open || child.icon) && (
                          <SidebarListItem
                            key={child.label}
                            label={child.label}
                            open={props.open}
                            onClick={() => navigate(child.url)}
                            selected={pathname === child.url}
                            variant="small"
                          >
                            {props.open ? null : child.icon}
                          </SidebarListItem>
                        )
                    )}
                </Fragment>
              )
          )}
        </List>
      )}

      <Divider sx={{ marginTop: 'auto' }} />

      <SidebarListItem label="Logout" open={props.open} onClick={handleLogout}>
        <LogoutIcon />
      </SidebarListItem>
    </>
  )
}
