import { createTheme } from '@mui/material/styles'

import { customColors, getM3Tokens } from './themeColours'
import { CustomColours, M3Theme, PaletteMode } from './types'

/** Width of non-collapsed sidebar */
export const sidebarWidth = '200px'

/**
 * Allow passing custom variables into {@link createTheme} by extending the type definition.
 * See: https://mui.com/materialui/customization/theming/#customvariables
 */
declare module '@mui/material/styles' {
  interface Theme extends M3Theme, CustomColours {}
  // allow configuration using `createTheme`
  interface ThemeOptions extends M3Theme, CustomColours {}
}

/** Generate MUI theme according to palette mode */
const generateTheme = (mode: PaletteMode) => {
  const tokens = getM3Tokens(mode)
  return {
    ...tokens,
    ...customColors,
    palette: {
      primary: { main: tokens.primary },
      secondary: { main: tokens.secondary },
    },
  }
}

/** Custom MUI theme */
export const theme = createTheme(generateTheme('light'))
