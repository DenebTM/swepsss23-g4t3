import React from 'react'

import Paper from '@mui/material/Paper'

interface TablePaperProps {
  children: React.ReactNode
}

/**
 * Reusable paper component used to wrap a DataGrid passed via `props.children`.
 * Defined as a reusable component to allow managing table paper styles in one place.
 */
export const TablePaper: React.FC<TablePaperProps> = (props) => {
  return <Paper>{props.children}</Paper>
}
