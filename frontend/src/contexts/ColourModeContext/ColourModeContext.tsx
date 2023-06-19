import React from 'react'

import { PaletteMode } from '@mui/material'

export type ColourMode = PaletteMode | 'auto'

export interface IColourModeContext {
  activeMode: ColourMode
  changeColourMode: (mode?: ColourMode) => void
}

const initialColourModeContext: IColourModeContext = {
  activeMode: 'auto',
  changeColourMode: () => {},
}

export const ColourModeContext = React.createContext(initialColourModeContext)
