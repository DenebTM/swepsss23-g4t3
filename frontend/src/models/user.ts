import { Timestamp } from './timestamp'

/** The type of a (unique) user id */
export type Username = string

/**
 * A single user
 */
export interface User {
  created: Timestamp
  firstName: string
  lastName: string
  username: Username
  role: UserRole
}

/**
 * Possible roles that a {@link User} can have.
 */
export enum UserRole {
  USER = 'USER',
  GARDENER = 'GARDENER',
  ADMIN = 'ADMIN',
}
