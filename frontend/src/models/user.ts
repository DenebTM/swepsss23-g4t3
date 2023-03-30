import { Timestamp } from './timestamp'

/**
 * A single user
 */
export interface User {
  created: Timestamp
  firstName: string
  lastName: string
  username: string
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
