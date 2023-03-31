import { useLocation, useNavigate } from 'react-router-dom'

import { useIsAdmin } from '~/hooks/user'

import { SidebarListItem } from './SidebarListItem'

/** Type of a general element which will be rendered as a sidebark link */
interface SidebarElement {
  adminOnly?: boolean
  label: string
  url: string
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
  const isAdmin = useIsAdmin()
  const { pathname } = useLocation()

  if (isAdmin && (props.adminOnly ?? true)) {
    return (
      <>
        <SidebarListItem
          label={props.label}
          open={props.open}
          onClick={() => navigate(props.url)}
          selected={pathname === props.url}
        >
          {props.icon}
        </SidebarListItem>
        {props.childNodes &&
          props.childNodes.map(
            (child: SidebarElement) =>
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
      </>
    )
  } else {
    return null // If the user is not an admin but the page requires admin priviledges
  }
}
