import axios, { AxiosError, AxiosResponse } from 'axios'

import { base64url, CompactSign } from 'jose'
import { Response, Server } from 'miragejs'
import { handleAxiosError } from '~/api/intercepts'
import { API_DEV_URL } from '~/common'
import { LoginResponse } from '~/models/login'

import { Endpoints } from '../mirageTypes'

const LOGIN_URI = `${API_DEV_URL}/handle-login`
const LOGOUT_URI = `${API_DEV_URL}/logout`

/**
 * Generate a JWT for mocking the login and logout functions.
 * Uses a different secret and algorithm to the backend as this function is only used for simple local tests.
 */
const secret = base64url.decode('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI')
const FAKE_JWT = await new CompactSign(
  new TextEncoder().encode(JSON.stringify({ authorities: 'ADMIN' }))
)
  .setProtectedHeader({ alg: 'HS256' })
  .sign(secret)

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
  'handle-login': (server: Server) => {
    server.post(LOGIN_URI, (schema, request) => {
      const body: { username: string; password: string } = JSON.parse(
        request.requestBody
      )
      if (body.username === 'admin' && body.password === 'passwd') {
        return new Response(200, {}, { token: FAKE_JWT })
      } else {
        return new Response(401, {}, { message: 'Unauthorised user' })
      }
    })
  },
  logout: (server: Server) => {
    server.post(LOGOUT_URI, () => new Response(200, {}, {}))
  },
}
