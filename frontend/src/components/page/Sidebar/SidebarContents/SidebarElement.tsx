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

  const showLink = (permittedRoles?: UserRole[]) =>
    typeof permittedRoles === 'undefined' || permittedRoles.includes(userRole)

  return (
    <>
      {showLink(props.permittedRoles) && (
        <SidebarListItem
          label={props.pageTitle}
          open={props.open}
          onClick={() => navigate(props.href)}
          selected={pathname === props.href}
        >
          {props.icon}
        </SidebarListItem>
      )}

      {props.childNodes &&
        props.childNodes.map(
          (child: SidebarElement) =>
            /** Render child elements in the sidebar only if open or if the child has an icon defined */
            (props.open || child.icon) &&
            showLink(child.permittedRoles) && (
              <SidebarListItem
                key={child.pageTitle}
                label={child.pageTitle}
                open={props.open}
                onClick={() => navigate(child.href)}
                selected={pathname === child.href.split('?')[0]} // Ignore query params
                variant="small"
              >
                {props.open ? null : child.icon}
              </SidebarListItem>
            )
        )}
    </>
  )
}
