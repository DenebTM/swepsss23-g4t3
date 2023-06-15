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
import { useUsername } from '~/hooks/user'
import { AuthUserRole, User, Username } from '~/models/user'

/** Table column field containing first name of user */
const FIRSTNAME = 'firstName'

/** Table column field containing last name of user */
const LASTNAME = 'lastName'

/** Table column field containing user role */
const USER_ROLE = 'userRole'

interface UsersTableProps {
  setUsers: Dispatch<SetStateAction<User[] | undefined>>
  users: User[] | undefined
}

/**
 * Display users in an editable, filterable table
 */
export const UsersTable: React.FC<UsersTableProps> = (props) => {
  const username = useUsername()

  /** Update a single user */
  const handleUpdateUser: RowUpdateFunction<User> = (
    newUser: User,
    oldUser: User
  ) => updateUser(oldUser.username, newUser)

  /** Width of name fields in px */
  const nameFieldWidth = 110

  /**
   * Columns for the user management table.
   * Whether cells are editable or not is further controlled dynamically via `isCellEditable` prop.
   */
  const columns: GridColDef<User, any, User>[] = [
    { field: 'username', headerName: 'Username', width: nameFieldWidth },
    {
      field: FIRSTNAME,
      headerName: 'First name',
      width: nameFieldWidth,
      editable: true,
    },
    {
      field: LASTNAME,
      headerName: 'Last name',
      width: nameFieldWidth,
      editable: true,
    },
    {
      field: USER_ROLE,
      headerName: 'Role',
      type: 'singleSelect',
      valueOptions: [
        { value: AuthUserRole.ADMIN, label: 'ADMIN' },
        { value: AuthUserRole.GARDENER, label: 'GARDENER' },
        { value: AuthUserRole.USER, label: 'USER' },
      ],
      headerAlign: 'center',
      align: 'center',
      width: 100,
      editable: true,
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
        isCellEditable={
          (params) =>
            params.field === FIRSTNAME ||
            params.field === LASTNAME ||
            (params.field === USER_ROLE &&
              params.row.username !== username) /** Prevent editing own role */
        }
        processRowUpdate={handleUpdateUser}
        rows={props.users}
        setRows={props.setUsers}
        fetchRows={getUsers}
      />
    </TablePaper>
  )
}
