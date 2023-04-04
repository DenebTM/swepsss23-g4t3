import { createTheme } from '@mui/material/styles'

import { customColors, getM3Tokens } from './themeColours'
import { CustomColours, M3Theme } from './types'

/** Width of non-collapsed sidebar */
export const sidebarWidth = '200px'

/** Colour of sidebar icons. qqjf to move into theme */
export const sidebarIconColour = '#777'

/**
 * Allow passing custom variables into {@link createTheme} by extending the type definition.
 * See: https://mui.com/materialui/customization/theming/#customvariables
 */
declare module '@mui/material/styles' {
  interface Theme extends M3Theme, CustomColours {}
  // allow configuration using `createTheme`
  interface ThemeOptions extends M3Theme, CustomColours {}
}

/** Custom MUI theme */
export const theme = createTheme({
  ...getM3Tokens('light'),
  ...customColors,
})
