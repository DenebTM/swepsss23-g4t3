import { useEffect, useState } from 'react'

import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useTheme } from '@mui/material/styles'

import { Tooltip } from '@component-lib/Tooltip'

interface SidebarListItemProps {
  children?: React.ReactNode
  label: string
  open: boolean
  onClick?: (() => Promise<void>) | (() => void)
  /** Whether the list item is corresponds tothe current page */
  selected?: boolean
  /** Reduce ListItem padding if variant is 'small' */
  variant?: 'small'
}

/**
 * ListItem for each icon and link in the Sidebar. Can be a child of `SidebarElement` or `SidebarContents`.
 * Shows only icon if `props.open` is false, otherwise shows the icon and `props.label`
 */
export const SidebarListItem: React.FC<SidebarListItemProps> = (props) => {
  const theme = useTheme()

  // Style constants
  const iconMarginSides = 10
  const sidebarListItemBorderRadius = 8
  const selectedColor = theme.onSecondaryContainer
  const unselectedColor = theme.onSurfaceVariant

  const [buttonDisabled, setButtonDisabled] = useState(props.selected)

  useEffect(() => setButtonDisabled(props.selected), [props.selected])

  const handleButtonClick = (): void => {
    if (typeof props.onClick !== 'undefined') {
      setButtonDisabled(true)

      const clickReturn = props.onClick()

      if (typeof clickReturn !== 'undefined') {
        // Disable clicked button during asynchronous event handling
        clickReturn
          .catch((err: Error) => {
            // For now if logout fails, then log the error to the console and allow users to retry
            console.error(err)
          })
          .finally(() => setButtonDisabled(props.selected))
      }
    }
  }

  return (
    <ListItem
      disablePadding
      sx={{
        display: 'block',
        background: props.selected ? theme.secondaryContainer : '',
        borderRadius: sidebarListItemBorderRadius,
        padding: props.open ? 0 : theme.spacing(0.5, 0),
      }}
    >
      <Tooltip
        title={props.open ? '' : props.label}
        placement="right"
        arrow
        spanSx={{
          display: 'inherit',
        }}
      >
        <ListItemButton
          disabled={buttonDisabled}
          onClick={handleButtonClick}
          sx={{
            justifyContent: props.open ? 'initial' : 'center',
            px: 2.5,
            '&.Mui-disabled': {
              opacity: 0.8,
            },
            color: props.selected ? selectedColor : unselectedColor,
            borderRadius: sidebarListItemBorderRadius,
            padding:
              props.variant === 'small'
                ? theme.spacing(0.5, 0)
                : theme.spacing(1, 0),
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: props.open ? `${iconMarginSides + 24}px` : 'auto',
              marginRight: props.open ? `${iconMarginSides}px` : 'auto',
              marginLeft: props.open ? `${iconMarginSides}px` : 'auto',
              justifyContent: 'center',
              color: 'inherit',
            }}
          >
            {props.children}
          </ListItemIcon>

          {props.open && (
            <ListItemText
              primary={props.label}
              sx={{
                opacity: props.open ? 1 : 0,
                color: 'inherit',
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  )
}
