import { Timestamp } from './timestamp'

/** The type of a (unique) user id */
export type Username = string

/**
 * A single user
 */
export interface User {
  createDate: Timestamp
  firstName: string
  lastName: string
  updateDate: Timestamp
  username: Username
  userRole: AuthUserRole
}

/**
 * Possible roles that a logged-in {@link User} can have.
 * Taken from the types used in the backend.
 */
export enum AuthUserRole {
  USER = 'USER',
  GARDENER = 'GARDENER',
  ADMIN = 'ADMIN',
}

/**
 * Enum for a guest (a user who is not currently logged in).
 * Defined separately to {@link AuthUserRole} as the backend does not support
 * this role, so the concepts should be kept separate.
 */
export enum GuestRole {
  GUEST = 'GUEST',
}

/** Union of roles of a logged-in or guest user. */
export type UserRole = AuthUserRole | GuestRole
