import { useEffect, useState } from 'react'

import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import { Tooltip } from '@component-lib/Tooltip'
import { theme } from '~/styles/theme'

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
        marginTop: 0,
        marginBottom: 0,
        background: props.selected ? theme.secondaryContainer : '',
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
            minHeight:
              props.variant === 'small' ? theme.spacing(3) : theme.spacing(6),
            justifyContent: props.open ? 'initial' : 'center',
            px: 2.5,
            '&.Mui-disabled': {
              opacity: 0.8,
            },
            color: props.selected
              ? theme.onSecondaryContainer
              : theme.onSurfaceVariant,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: props.open ? 3 : 'auto',
              justifyContent: 'center',
              color: 'inherit',
            }}
          >
            {props.children}
          </ListItemIcon>

          <ListItemText
            primary={props.label}
            sx={{
              opacity: props.open ? 1 : 0,
              color: 'inherit',
            }}
          />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  )
}
