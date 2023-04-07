import React, { Dispatch, SetStateAction } from 'react'

import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

import { DataGrid, RowUpdateFunction } from '@component-lib/DataGrid'
import dayjs from 'dayjs'
import { getUsers, updateUser } from '~/api/endpoints/user'
import { User, UserRole } from '~/models/user'

const columns: GridColDef<User, any, User>[] = [
  { field: 'username', headerName: 'Username', flex: 1 },
  {
    field: 'firstName',
    headerName: 'First name',
    type: 'string',
    editable: true,
    flex: 1,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    type: 'string',
    editable: true,
    flex: 1,
  },
  {
    field: 'role',
    headerName: 'Role',
    type: 'singleSelect',
    valueOptions: [
      { value: UserRole.ADMIN, label: 'ADMIN' },
      { value: UserRole.GARDENER, label: 'GARDENER' },
      { value: UserRole.USER, label: 'USER' },
    ],
    editable: true,
    flex: 1,
  },
  {
    field: 'created',
    headerName: 'Created',
    description: 'When the user was created',
    type: 'dateTime',
    flex: 1,
    valueGetter: (params: GridValueGetterParams<User, string>) =>
      dayjs(params.value).toDate(),
  },
]

interface UsersTableProps {
  setUsers: Dispatch<SetStateAction<User[] | undefined>>
  users: User[] | undefined
}

/**
 * Display users in an editable, filterable table
 */
export const UsersTable: React.FC<UsersTableProps> = (props) => {
  /** Update a single user */
  const handleUpdateUser: RowUpdateFunction<User> = (
    newUser: User,
    oldUser: User
  ) => updateUser(oldUser.username, newUser)

  return (
    <DataGrid<User, any, User>
      columns={columns}
      getRowId={(row: User) => row.username}
      processRowUpdate={handleUpdateUser}
      rows={props.users}
      setRows={props.setUsers}
      fetchRows={getUsers}
    />
  )
}
