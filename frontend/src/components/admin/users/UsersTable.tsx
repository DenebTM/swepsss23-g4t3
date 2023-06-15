import React, { Dispatch, SetStateAction } from 'react'

import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid'

import { DataGrid, RowUpdateFunction } from '@component-lib/Table/DataGrid'
import { DeleteCell } from '@component-lib/Table/DeleteCell'
import { TablePaper } from '@component-lib/Table/TablePaper'
import dayjs from 'dayjs'
import { deleteUser, getUsers, updateUser } from '~/api/endpoints/user'
import { AuthUserRole, User, Username } from '~/models/user'

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

  /** Width of name fields in px */
  const nameFieldWidth = 110

  /** Columns for the user management table */
  const columns: GridColDef<User, any, User>[] = [
    { field: 'username', headerName: 'Username', width: nameFieldWidth },
    {
      field: 'firstName',
      headerName: 'First name',
      editable: true,
      width: nameFieldWidth,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      editable: true,
      width: nameFieldWidth,
    },
    {
      field: 'userRole',
      headerName: 'Role',
      type: 'singleSelect',
      valueOptions: [
        { value: AuthUserRole.ADMIN, label: 'ADMIN' },
        { value: AuthUserRole.GARDENER, label: 'GARDENER' },
        { value: AuthUserRole.USER, label: 'USER' },
      ],
      headerAlign: 'center',
      align: 'center',
      editable: true,
      width: 100,
    },
    {
      field: 'createDate',
      headerName: 'Created',
      description: 'When the user was created',
      type: 'dateTime',
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams<User, string>) =>
        dayjs(params.value).toDate(),
      width: 170,
    },
    {
      field: 'updateDate',
      headerName: 'Updated',
      description: 'When the user was last updated',
      type: 'dateTime',
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: GridValueGetterParams<User, string>) =>
        dayjs(params.value).toDate(),
      width: 170,
    },
    {
      field: 'action',
      headerName: 'Delete',
      description: 'Delete the given user',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<User, any, User>) => (
        <DeleteCell<User, Username>
          deleteEntity={deleteUser}
          entityId={params.row.username}
          entityName="user"
          getEntityId={(r) => r.username}
          setRows={props.setUsers}
        />
      ),
      width: 75,
    },
  ]

  return (
    <TablePaper>
      <DataGrid<User, any, User>
        columns={columns}
        getRowId={(row: User) => row.username}
        processRowUpdate={handleUpdateUser}
        rows={props.users}
        setRows={props.setUsers}
        fetchRows={getUsers}
      />
    </TablePaper>
  )
}
