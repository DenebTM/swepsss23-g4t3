import { decodeJwt, JWTPayload } from 'jose'
import Cookies from 'universal-cookie'
import { AUTH_JWT } from '~/common'
import { UserRole } from '~/models/user'

/**
 * Load the saved JWT cookie with key {@link AUTH_JWT}
 * @returns The currently set JWT if it exists, otherwise null
 */
export const getJwt = (): string | null => {
  const cookies = new Cookies()
  const jwt = cookies.get<string>(AUTH_JWT)
  return jwt ?? null
}

/**
 * Save the given JWT as a cookie with key {@link AUTH_JWT}
 * @param jwt The token to save as a cookie
 */
export const setJwt = (jwt: string): void => {
  const cookies = new Cookies()

  const jwtPayload = isJwtValid(jwt)
  if (jwtPayload != null && typeof jwtPayload.exp !== 'undefined') {
    cookies.set(AUTH_JWT, jwt, {
      path: '/',
      sameSite: 'none',
      secure: true,
      // exp is Unix timestamp in seconds, JS expects milliseconds
      expires: new Date(jwtPayload.exp * 1000),
    })
  }
}

/**
 * Checks the JWT token stored in cookies or provided via `jwt` for validity.
 * @param jwt optional; a specific token to check. If undefined then the JWT will be loaded from local cookies..
 * @returns a {@link JWTPayload} if the token can be deoded and has not expired, `null` otherwise.
 */
export const isJwtValid = (jwt?: string | null): JWTPayload | null => {
  // If not given as an argument, load JWT from cookies
  if (typeof jwt === 'undefined') jwt = getJwt()

  if (jwt !== null) {
    const claims: JWTPayload = decodeJwt(jwt)

    // Check that token has not expired . exp is Unix timestamp in seconds, JS expects milliseconds
    if (typeof claims.exp !== 'undefined' && claims.exp * 1000 >= Date.now()) {
      return claims
    }
  }

  return null
}

/**
 * Delete the saved JWT cookie with key {@link AUTH_JWT} (if it exists)
 */
export const deleteJwt = (): void => {
  const cookies = new Cookies()
  cookies.remove(AUTH_JWT)
}

/**
 * Load the JWT from cookies and return the role of the logged-in user.
 * @returns The user role if found, otherwise null
 */
export const getUseRoleFromJwt = (): UserRole | null => {
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

  return null
}
