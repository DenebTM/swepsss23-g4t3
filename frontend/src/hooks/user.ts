import { getUserRoleFromJwt } from '~/helpers/jwt'
import { AuthUserRole, GuestRole, UserRole } from '~/models/user'

/**
 * Hook to decode the JWT in cookies and return a list of roles assigned ot the current user
 * Must obey the rules of hooks (https://reactjs.org/docs/hooks-rules.html)
 * @returns The role of the logged in user.
 */
export const useUserRole = (): UserRole => {
  const role: AuthUserRole | null = getUserRoleFromJwt()
  return role === null ? GuestRole.GUEST : role
}

/**
 * Hook to decode the JWT in cookies and return a boolean of whether the logged-in user is an admin.
 */
export const useIsAdmin = (): boolean => {
  const role: AuthUserRole | null = getUserRoleFromJwt()
  return role === AuthUserRole.ADMIN
}
