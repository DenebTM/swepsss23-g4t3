import { forwardRef, useEffect } from 'react'

import MuiDrawer from '@mui/material/Drawer'
import { CSSObject, styled, Theme } from '@mui/material/styles'

import { sidebarWidth } from '~/styles/theme'

const openedMixin = (theme: Theme): CSSObject => ({
  width: sidebarWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: sidebarWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...((open ?? false) && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!(open ?? false) && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

interface CustomDrawerProps {
  children: React.ReactNode
  open: boolean
}
/**
 * Custom Drawer component with open and close animations
 * Wrapped in a forward Ref so that the component can be wrapped in a click away listener
 */
export const CustomDrawer: React.FC<CustomDrawerProps> = forwardRef(
  (props, ref: React.ForwardedRef<HTMLDivElement>) => {
    useEffect(() => {
      // Trigger rerender on props.open change
    }, [props.open])

    return (
      <Drawer
        variant="permanent"
        open={props.open}
        PaperProps={{
          sx: {
            color: '#474747', // Icon and text colour (qqjf to do: use theme colour)
          },
        }}
        ref={ref}
      >
        {props.children}
      </Drawer>
    )
  }
)

// Set a display name for forward Ref
CustomDrawer.displayName = 'CustomDrawer'
