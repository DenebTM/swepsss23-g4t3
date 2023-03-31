import { JWTPayload } from 'jose'
import { isJwtValid } from '~/helpers/jwt'
import { UserRole } from '~/models/user'

/**
 * Hook to decode the JWT in cookies and return a list of roles assigned ot the current user
 * Must obey the rules of hooks (https://reactjs.org/docs/hooks-rules.html)
 * @returns The role of the logged in user. If no role can be determined, defaults to {@link UserRole.USER}.
 */
export const useUserRole = (): UserRole => {
  // Load JWT from cookies
  const jwt: JWTPayload | null = isJwtValid()

  // Check that JWT contains a valid user role
  if (jwt !== null && 'authorities' in jwt) {
    const role = jwt.authorities
    if (
      typeof role === 'string' &&
      Object.values(UserRole).includes(role as UserRole)
    ) {
      return role as UserRole
    }
  }

  // Default case: return the role with the fewest authorities
  return UserRole.USER
}
