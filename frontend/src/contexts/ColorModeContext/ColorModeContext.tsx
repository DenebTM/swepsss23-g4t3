import React from 'react'

import { PaletteMode } from '@mui/material'

export type ColorMode = PaletteMode | 'auto'

export interface IColorModeContext {
  activeMode: ColorMode
  changeColorMode: (mode?: ColorMode) => void
}

const initialColorModeContext: IColorModeContext = {
  activeMode: 'auto',
  changeColorMode: () => {},
}

export const ColorModeContext = React.createContext(initialColorModeContext)
