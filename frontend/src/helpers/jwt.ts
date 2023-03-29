import jwt_decode from 'jwt-decode'
import Cookies from 'universal-cookie'
import { AUTH_JWT } from '~/common'

/**
 * Load the saved JWT cookie with key AUTH_JWT
 * @returns The currently set JWT if it exists, otherwise null
 */
export const getJwt = (): string | null => {
  const cookies = new Cookies()
  const jwt = cookies.get<string>(AUTH_JWT)
  return jwt ?? null
}

/**
 * Save the given JWT as a cookie with key AUTH_JWT
 * @param jwt The token to save as a cookie
 */
export const setJwt = (jwt: string): void => {
  const cookies = new Cookies()
  if (isJwtValid(jwt)) {
    const { exp } = jwt_decode<Record<string, any> & { exp: number }>(jwt)
    cookies.set(AUTH_JWT, jwt, {
      path: '/',
      sameSite: 'none',
      secure: true,
      // exp is Unix timestamp in seconds, JS expects milliseconds
      expires: new Date(exp * 1000),
    })
  }
}

/**
 * Checks the JWT token stored in cookies or provided via `jwt` for validity
 * @param jwt optional; a specific token to check
 * @returns `true` if the token is not `null` and has not expired, `false` otherwise
 */
export const isJwtValid = (jwt?: string | null): boolean => {
  if (typeof jwt === 'undefined') jwt = getJwt()

  if (jwt !== null) {
    const decodedJwt: unknown = jwt_decode(jwt)

    // Check that decodedJwt is a non-null object
    if (
      typeof decodedJwt === 'object' &&
      decodedJwt !== null &&
      'exp' in decodedJwt
    ) {
      const tokenExpiry = decodedJwt.exp
      if (typeof tokenExpiry === 'number' && Number.isInteger(tokenExpiry)) {
        // Check that token has not expired
        return tokenExpiry * 1000 >= Date.now()
      }
    }
  }

  return false
}

/**
 * Delete the saved JWT cookie with key AUTH_JWT (if it exists)
 */
export const deleteJwt = (): void => {
  const cookies = new Cookies()
  cookies.remove(AUTH_JWT)
}
