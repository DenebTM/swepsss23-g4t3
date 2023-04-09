import { createTheme } from '@mui/material/styles'

import { customColors, getM3Tokens } from './colours/themeColours'
import { CustomColours, M3Theme, PaletteMode } from './colours/types'
import { typographyTheme } from './typography/themeTypography'
import { TypographyVariant } from './typography/types'

/**
 * Allow passing custom variables into {@link createTheme} by extending the type definition.
 * See: https://mui.com/materialui/customization/theming/#customvariables
 */
declare module '@mui/material/styles' {
  // Add custom colours and typography variants to the Theme
  interface Theme extends M3Theme, CustomColours {}
  type TypographyVariants = Record<TypographyVariant, React.CSSProperties>

  // Allow configuring colours and typography using `createTheme`
  interface ThemeOptions extends M3Theme, CustomColours {}
  type TypographyVariantsOptions = Partial<
    Record<TypographyVariant, React.CSSProperties>
  >
}

/**
 * Define a separate type equal to the original `TypographyPropsVariantOverrides` inside @mui/material/Typography,
 * as otherwise TypeScript (rightly) complains about circular references. This is needed so that TypeScript recognises that
 * this is a correct extension of `TypographyPropsVariantOverrides`.
 */
type BaseTypographyPropsVariantOverrides = object

/** Allow passing custom {@link TypographyVariant} values to the MUI Typography component */
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides
    extends Record<TypographyVariant, true>,
      BaseTypographyPropsVariantOverrides {}
}

/** Width of non-collapsed sidebar */
export const sidebarWidth = '200px'

// Padding for input chips, filter chips, and buttons
const medChipPadding = '14px 16px'
const smallChipPadding = '8px 12px'

/** Generate MUI theme according to palette mode */
const generateTheme = (mode: PaletteMode) => {
  const tokens = getM3Tokens(mode)

  return {
    ...tokens,
    ...customColors,

    // Add M3 theme to default MUI palette
    palette: {
      primary: { main: tokens.primary },
      secondary: { main: tokens.secondary },
      error: { main: tokens.error },
      warning: { main: customColors.warn },
      info: { main: tokens.onSurface },
      success: { main: tokens.primary },
      text: {
        primary: tokens.onSurface,
        secondary: tokens.onSurfaceVariant,
        disabled: tokens.onSurfaceVariant,
        hint: tokens.onSurfaceVariant,
        outline: tokens.outline,
      },
      divider: tokens.outlineVariant,
      background: { default: tokens.background, paper: tokens.surfaceBright },
      // Add custom colour options
      onSurface: tokens.onSurface,
      onSurfaceVariant: tokens.onSurfaceVariant,
      outline: tokens.outline,
    },

    // Component overrides
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none' as const,
            ...chipTypography,
            padding: medChipPadding,
          },
          sizeSmall: { padding: smallChipPadding },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            ...chipTypography,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: tokens.outline,
            },
          },
          input: { padding: medChipPadding },
          notchedOutline: {
            borderColor: tokens.outlineVariant,
          },
          sizeSmall: { padding: smallChipPadding },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { ...chipTypography },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: { ...chipTypography },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            '&:before': {
              backgroundColor: tokens.outlineVariant,
            },
          },
        },
      },
    },
  }
}

/** Label style for buttons and chips */
const chipTypography = typographyTheme.labelLarge

/** Custom MUI theme */
export const theme = createTheme({
  ...generateTheme('light'),
  typography: {
    // Add M3 typography variants
    ...typographyTheme,
    // Override default typography variants with M3 styles
    h1: { ...typographyTheme.displayLarge },
    h2: { ...typographyTheme.displayMedium },
    h3: { ...typographyTheme.displaySmall },
    h4: { ...typographyTheme.headlineLarge },
    h5: { ...typographyTheme.headlineMedium },
    h6: { ...typographyTheme.headlineSmall },
    subtitle1: { ...typographyTheme.titleLarge },
    subtitle2: { ...typographyTheme.titleMedium },
    body1: { ...typographyTheme.bodyLarge },
    body2: { ...typographyTheme.bodyMedium },
    caption: { ...typographyTheme.labelSmall },
    button: { ...chipTypography },
    overline: { ...typographyTheme.labelSmall },
  },
})
