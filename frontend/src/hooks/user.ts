import { getSubFromJwt, getUserRoleFromJwt } from '~/helpers/jwt'
import { AuthUserRole, GuestRole, Username, UserRole } from '~/models/user'

/**
 * Hook to decode the JWT in cookies and return a list of roles assigned to the current user
 * Must obey the rules of hooks (https://reactjs.org/docs/hooks-rules.html)
 * @returns The role of the logged in user.
 */
export const useUserRole = (): UserRole => {
  const role: AuthUserRole | null = getUserRoleFromJwt()
  return role === null ? GuestRole.GUEST : role
}

/**
 * Hook to decode the JWT in cookies and return the username.
 * Must obey the rules of hooks (https://reactjs.org/docs/hooks-rules.html)
 * @returns The username of the logged in user.
 */
export const useUsername = (): Username => {
  const username: Username | undefined = getSubFromJwt()
  return username ?? ''
}

/**
 * Hook to decode the JWT in cookies and return a boolean of whether the logged-in user is an admin.
 */
export const useIsAdmin = (): boolean => {
  const role: AuthUserRole | null = getUserRoleFromJwt()
  return role === AuthUserRole.ADMIN
}
