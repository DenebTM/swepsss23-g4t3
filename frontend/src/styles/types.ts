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
  /** Primary colours */
  primary: string
  onprimary: string
  primarycontainer: string
  onprimarycontainer: string
  /** Secondary colours */
  secondary: string
  onsecondary: string
  secondarycontainer: string
  onsecondarycontainer: string
  /** Tertiary colours */
  tertiary: string
  ontertiary: string
  tertiarycontainer: string
  ontertiarycontainer: string
  /** Error colours */
  error: string
  errorcontainer: string
  onerror: string
  onerrorcontainer: string
  /** Surface colours */
  background: string
  onbackground: string
  surface: string
  onsurface: string
  /** Surface variant colours */
  surfacevariant: string
  onsurfacevariant: string
  outline: string
  outlinevariant: string
  /** Inverse colours */
  inverseonsurface: string
  inversesurface: string
  inverseprimary: string
  /** Shadows and tints */
  shadow: string
  surfacetint: string
  scrim: string
}

/** Types for specifying whether to use a light or dark theme */
export type PaletteMode = 'light' | 'dark'

/**
 * Define custom colours needed for theme.
 * See Material Design 3 docs for usage: https://m3.material.io/styles/color/thecolorsystem/keycolorstones
 * Dark theme is currently not supported.
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
  warn: string
  green: string
  tertiary: string
  blue: string
  purple: string
  pink: string
}
