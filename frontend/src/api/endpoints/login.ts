import axios, { AxiosError, AxiosResponse } from 'axios'

import { base64url, CompactSign } from 'jose'
import { Server } from 'miragejs'
import { handleAxiosError } from '~/api/intercepts'
import { API_DEV_URL } from '~/common'
import { LoginResponse } from '~/models/login'

import { Endpoints } from '../mirageTypes'
import { success, unauthorised } from './helpers'

const LOGIN_URI = `${API_DEV_URL}/handle-login`
const LOGOUT_URI = `${API_DEV_URL}/logout`

/** Hard-code a secret for the mocked JWT */
const SECRET = base64url.decode('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI')
/** Convert token expiry timestamp from milliseconds to seconds for consistency with backend and set expiry to 1 hour  */
const token_exp = Math.round(Date.now() / 1000 + 60 * 60)

/**
 * Generate a JWT for mocking the login and logout functions.
 * Uses a different secret and algorithm to the backend as this function is only used for simple local tests.
 */
const FAKE_JWT = await new CompactSign(
  new TextEncoder().encode(
    JSON.stringify({ authorities: 'ADMIN', exp: token_exp })
  )
)
  .setProtectedHeader({ alg: 'HS256' })
  .sign(SECRET)

/**
 * @param username The username of the user to log in
 * @param password The password of the user
 * @returns A promise which resolves only if the login is successful
 */
export const handleLogin = (
  username: string,
  password: string
): Promise<AxiosResponse<LoginResponse>> =>
  axios
    .post(LOGIN_URI, {
      username,
      password,
    })
    .then((res) => res)
    .catch((err: AxiosError) => {
      throw Error(handleAxiosError(err))
    })

/**
 * Post to the backend to log out the currently logged-in user
 */
export const logout = async (): Promise<void> => {
  await axios.post(LOGOUT_URI).catch((err: AxiosError) => {
    throw Error(handleAxiosError(err))
  })
}

/**
 * Mocked login and logout functions. Currently hardcodes acceptable login credentials.
 */
export const mockedLoginEndpoints: Endpoints = {
  /** Mock {@link handleLogin} */
  'handle-login': (server: Server) => {
    server.post(LOGIN_URI, (schema, request) => {
      const body: { username: string; password: string } = JSON.parse(
        request.requestBody
      )

      if (body.username === 'admin' && body.password === 'passwd') {
        return success({ token: FAKE_JWT })
      } else {
        return unauthorised()
      }
    })
  },

  /** Mock {@link logout} */
  logout: (server: Server) => {
    server.post(LOGOUT_URI, () => success())
  },
}
