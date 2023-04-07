import { createTheme } from '@mui/material/styles'

import { customColors, getM3Tokens } from './colours/themeColours'
import { CustomColours, M3Theme, PaletteMode } from './colours/types'
import { typographyTheme } from './typography/themeTypography'

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

    // Add M3 theme to
    palette: {
      primary: { main: tokens.primary },
      secondary: { main: tokens.secondary },
    },
  }
}

/** Padding for input chips, filter chips, and buttons */
const chipPadding = '14px 14px'

/** Custom MUI theme */
export const theme = createTheme({
  ...generateTheme('light'),
  // Override default typography styles
  typography: {
    h1: { ...typographyTheme.display.large },
    h2: { ...typographyTheme.display.medium },
    h3: { ...typographyTheme.display.small },
    h4: { ...typographyTheme.headline.large },
    h5: { ...typographyTheme.headline.medium },
    h6: { ...typographyTheme.headline.small },
    subtitle1: { ...typographyTheme.title.large },
    subtitle2: { ...typographyTheme.title.medium },
    body1: { ...typographyTheme.body.large },
    body2: { ...typographyTheme.body.medium },
    caption: { ...typographyTheme.label.small },
    button: { ...typographyTheme.label.large },
    overline: { ...typographyTheme.label.small },
  },
  // Component overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          ...typographyTheme.label.large,
          padding: chipPadding,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { ...typographyTheme.label.large },
        input: { padding: chipPadding },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { ...typographyTheme.label.large },
      },
    },
  },
})
