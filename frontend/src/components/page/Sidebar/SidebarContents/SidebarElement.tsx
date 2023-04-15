import { useLocation, useNavigate } from 'react-router-dom'

import { useUserRole } from '~/hooks/user'
import { UserRole } from '~/models/user'

import { SidebarListItem } from './SidebarListItem'

/** Type of a general element which will be rendered as a sidebark link */
interface SidebarElement {
  permittedRoles?: UserRole[]
  pageTitle: string
  href: string
  icon?: JSX.Element
}
/** A single sidebar element with subelements */
export type SidebarElementWithChildren = SidebarElement & {
  childNodes?: SidebarElement[]
}

interface SidebarElementProps extends SidebarElementWithChildren {
  /** Whether the sidebar is open */
  open: boolean
}
/**
 * A single sidebar element (possible with child elements). Should be a direct child of `SidebarContents`.
 */
export const SidebarElement: React.FC<SidebarElementProps> = (props) => {
  const navigate = useNavigate()
  const userRole = useUserRole()
  const { pathname } = useLocation()

  if (!props.permittedRoles || props.permittedRoles.includes(userRole)) {
    return (
      <>
        <SidebarListItem
          label={props.pageTitle}
          open={props.open}
          onClick={() => navigate(props.href)}
          selected={pathname === props.href}
        >
          {props.icon}
        </SidebarListItem>
        {props.childNodes &&
          props.childNodes.map(
            (child: SidebarElement) =>
              /** Render child elements in the sidebar only if open or if the child has an icon defined */
              (props.open || child.icon) && (
                <SidebarListItem
                  key={child.pageTitle}
                  label={child.pageTitle}
                  open={props.open}
                  onClick={() => navigate(child.href)}
                  selected={pathname === child.href}
                  variant="small"
                >
                  {props.open ? null : child.icon}
                </SidebarListItem>
              )
          )}
      </>
    )
  } else {
    return null // If the user does not have the right to access the page
  }
}
