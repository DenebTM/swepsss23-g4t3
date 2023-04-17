import { getUserRoleFromJwt } from '~/helpers/jwt'
import { UserRole } from '~/models/user'

/**
 * Hook to decode the JWT in cookies and return a list of roles assigned ot the current user
 * Must obey the rules of hooks (https://reactjs.org/docs/hooks-rules.html)
 * @returns The role of the logged in user. If no role can be determined, defaults to {@link UserRole.USER}.
 */
export const useUserRole = (): UserRole | null => getUserRoleFromJwt()

/**
 * Hook to decode the JWT in cookies and return a boolean of whether the logged-in user is an admin.
 */
export const useIsAdmin = (): boolean => {
  const role: UserRole | null = getUserRoleFromJwt()
  return role === UserRole.ADMIN
}
