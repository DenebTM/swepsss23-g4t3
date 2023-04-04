import {
  CustomColours,
  M3Colours,
  M3Theme,
  PaletteMode,
  TonalPalette,
} from './types'

/** Primary {@link TonalPalette} - should not be manually modified */
const primary: TonalPalette = {
  0: '#000000',
  10: '#002105',
  20: '#00390c',
  25: '#004611',
  30: '#015316',
  35: '#155f21',
  40: '#246c2c',
  50: '#3f8643',
  60: '#59a05a',
  70: '#73bc72',
  80: '#8ed88b',
  90: '#a9f5a5',
  95: '#c8ffc1',
  98: '#ebffe5',
  99: '#f6fff0',
  100: '#ffffff',
}

/** Secondary {@link TonalPalette} - should not be manually modified */
const secondary: TonalPalette = {
  0: '#000000',
  10: '#101f10',
  20: '#253423',
  25: '#303f2e',
  30: '#3b4b39',
  35: '#465744',
  40: '#52634f',
  50: '#6a7c67',
  60: '#849680',
  70: '#9eb099',
  80: '#b9ccb4',
  90: '#d5e8cf',
  95: '#e3f6dd',
  98: '#ecffe5',
  99: '#f6fff0',
  100: '#ffffff',
}

/** Tertiary {@link TonalPalette} - should not be manually modified */
const tertiary: TonalPalette = {
  0: '#000000',
  10: '#001f23',
  20: '#00363b',
  25: '#104247',
  30: '#1f4d53',
  35: '#2c595e',
  40: '#39656b',
  50: '#527e84',
  60: '#6b989e',
  70: '#86b3b9',
  80: '#a1ced5',
  90: '#bcebf1',
  95: '#cbf9ff',
  98: '#ebfdff',
  99: '#f5feff',
  100: '#ffffff',
}

/** Neutral {@link TonalPalette} - should not be manually modified */
const neutral: TonalPalette = {
  0: '#000000',
  10: '#1a1c19',
  20: '#2f312d',
  25: '#3a3c38',
  30: '#454743',
  35: '#51534f',
  40: '#5d5f5a',
  50: '#767873',
  60: '#90918c',
  70: '#aaaca6',
  80: '#c6c7c1',
  90: '#e2e3dd',
  95: '#f0f1eb',
  98: '#f9faf4',
  99: '#fcfdf6',
  100: '#ffffff',
}

/** Neutral-variant {@link TonalPalette} - should not be manually modified */
const neutralVariant: TonalPalette = {
  0: '#000000',
  10: '#171d16',
  20: '#2c322a',
  25: '#373d35',
  30: '#424940',
  35: '#4e544b',
  40: '#5a6057',
  50: '#72796f',
  60: '#8c9388',
  70: '#a7ada2',
  80: '#c2c9bd',
  90: '#dee5d9',
  95: '#ecf3e7',
  98: '#f5fbef',
  99: '#f8fef2',
  100: '#ffffff',
}

/** Error {@link TonalPalette} - should not be manually modified */
const error: TonalPalette = {
  0: '#000000',
  10: '#410002',
  20: '#690005',
  25: '#7e0007',
  30: '#93000a',
  35: '#a80710',
  40: '#ba1a1a',
  50: '#de3730',
  60: '#ff5449',
  70: '#ff897d',
  80: '#ffb4ab',
  90: '#ffdad6',
  95: '#ffedea',
  98: '#fff8f7',
  99: '#fffbff',
  100: '#ffffff',
}

/**
 * Light theme exported from https://m3.material.io/theme-builder#/dynamic
 * Should not be manually modified.
 */
const lightTheme: M3Colours = {
  primary: '#246c2c',
  onprimary: '#ffffff',
  primarycontainer: '#a9f5a5',
  onprimarycontainer: '#002105',
  secondary: '#52634f',
  onsecondary: '#ffffff',
  secondarycontainer: '#d5e8cf',
  onsecondarycontainer: '#101f10',
  tertiary: '#39656b',
  ontertiary: '#ffffff',
  tertiarycontainer: '#bcebf1',
  ontertiarycontainer: '#001f23',
  error: '#ba1a1a',
  errorcontainer: '#ffdad6',
  onerror: '#ffffff',
  onerrorcontainer: '#410002',
  background: '#fcfdf6',
  onbackground: '#1a1c19',
  surface: '#fcfdf6',
  onsurface: '#1a1c19',
  surfacevariant: '#dee5d9',
  onsurfacevariant: '#424940',
  outline: '#72796f',
  inverseonsurface: '#f0f1eb',
  inversesurface: '#2f312d',
  inverseprimary: '#8ed88b',
  shadow: '#000000',
  surfacetint: '#246c2c',
  outlinevariant: '#c2c9bd',
  scrim: '#000000',
}

/**
 * Dark theme exported from https://m3.material.io/theme-builder#/dynamic
 * Should not be manually modified.
 */
const darkTheme: M3Colours = {
  primary: '#8ed88b',
  onprimary: '#00390c',
  primarycontainer: '#015316',
  onprimarycontainer: '#a9f5a5',
  secondary: '#b9ccb4',
  onsecondary: '#253423',
  secondarycontainer: '#3b4b39',
  onsecondarycontainer: '#d5e8cf',
  tertiary: '#a1ced5',
  ontertiary: '#00363b',
  tertiarycontainer: '#1f4d53',
  ontertiarycontainer: '#bcebf1',
  error: '#ffb4ab',
  errorcontainer: '#93000a',
  onerror: '#690005',
  onerrorcontainer: '#ffdad6',
  background: '#1a1c19',
  onbackground: '#e2e3dd',
  surface: '#1a1c19',
  onsurface: '#e2e3dd',
  surfacevariant: '#424940',
  onsurfacevariant: '#c2c9bd',
  outline: '#8c9388',
  inverseonsurface: '#1a1c19',
  inversesurface: '#e2e3dd',
  inverseprimary: '#246c2c',
  shadow: '#000000',
  surfacetint: '#8ed88b',
  outlinevariant: '#424940',
  scrim: '#000000',
}

/**
 * Return either light or dark theme exported from https://m3.material.io/theme-builder#/dynamic
 * Should not be manually modified.
 */
export const getM3Tokens = (mode: PaletteMode): M3Theme => ({
  mode,
  ref: {
    error: error,
    neutral: neutral,
    neutralVariant: neutralVariant,
  },
  sys: {
    primary: primary,
    secondary: secondary,
    tertiary: tertiary,
  },
  ...(mode === 'light' ? lightTheme : darkTheme),
})

export const customColors: CustomColours = {
  warn: '#ec9f07',
  green: '#00a769',
  tertiary: '#39656b',
  blue: '#5680b3',
  purple: '#a171b7',
  pink: '#fa687e',
}
