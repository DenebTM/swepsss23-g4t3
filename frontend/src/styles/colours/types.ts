/**
 * Interface for the stops defined in the M3 tonal palette:
 * https://m3.material.io/styles/color/thecolorsystem/keycolorstones#6bdb9471b70d42c98ace76743c1fff13
 */
export interface TonalPalette {
  0: string
  10: string
  20: string
  25: string
  30: string
  35: string
  40: string
  50: string
  60: string
  70: string
  80: string
  90: string
  95: string
  98: string
  99: string
  100: string
}
/**
 * Interface for the colours in an M3 theme:
 * https://m3.material.io/styles/color/thecolorsystem/colorroles
 */
export interface M3Colours {
  // Primary colours
  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
  // Secondary colours
  secondary: string
  onSecondary: string
  secondaryContainer: string
  onSecondaryContainer: string
  // Tertiary colours
  tertiary: string
  onTertiary: string
  tertiaryContainer: string
  onTertiaryContainer: string
  // Error colours
  error: string
  errorContainer: string
  onError: string
  onErrorContainer: string
  // Surface colours
  background: string
  onBackground: string
  surface: string
  onSurface: string
  surfaceLowest: string
  // Surface variant colours
  surfaceVariant: string
  onSurfaceVariant: string
  outline: string
  outlineVariant: string
  // Inverse colours
  inverseOnSurface: string
  inverseSurface: string
  inversePrimary: string
  // Shadows and tints
  shadow: string
  surfaceTint: string
  scrim: string
  // Alternative colours: https://m3.material.io/styles/color/the-color-system/color-roles#82db4b8f-240d-4d7b-b06d-58f3ee65159c
  surfaceBright: string
}

/** Types for specifying whether to use a light or dark theme */
export type PaletteMode = 'light' | 'dark'

/**
 * Define custom colours needed for theme.
 * See Material Design 3 docs for usage: https://m3.material.io/styles/color/thecolorsystem/keycolorstones
 */
export interface M3Theme extends M3Colours {
  mode: PaletteMode
  ref: {
    error: TonalPalette
    neutral: TonalPalette
    neutralVariant: TonalPalette
  }
  sys: {
    primary: TonalPalette
    secondary: TonalPalette
    tertiary: TonalPalette
  }
}

/**
 * Additional colours used in the theme. Should be used sparingly.
 */
export interface CustomColours {
  warnContainer: string
  warn: string
  onWarnContainer: string
  green: string
  tertiary: string
  blue: string
  purple: string
  pink: string
}
