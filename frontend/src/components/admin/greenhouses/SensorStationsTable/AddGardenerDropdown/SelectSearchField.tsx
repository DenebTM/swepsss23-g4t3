import React, { Dispatch, SetStateAction } from 'react'

import ClickAwayListener from '@mui/base/ClickAwayListener'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'

interface SelectSearchFieldProps {
  closeSelect: () => void
  setSearch: Dispatch<SetStateAction<string>>
}

/**
 * Search field to be used inside a select component. Deliberately doesn't close the select component on click.
 * This wrapper is needed to avoid passing the default props of Select children to the ClickAwayListener.
 * @see https://github.com/krutik2403/react-searchable-select-mui/blob/master/src/SearchableSelect.tsx
 */
export const SelectSearchField: React.FC<SelectSearchFieldProps> = (props) => {
  return (
    <ClickAwayListener onClickAway={props.closeSelect}>
      <ListItem>
        <TextField
          fullWidth
          placeholder="Search..."
          onChange={(e) => props.setSearch(e.target.value)}
          label="Username"
          onKeyDown={(e) => {
            // Prevent MUI from autoselecting the element
            e.stopPropagation()
          }}
          onClick={(e) => {
            // Prevent autoselecting the dropdown
            e.stopPropagation()
          }}
        />
      </ListItem>
    </ClickAwayListener>
  )
}
