import axios, { AxiosError, AxiosResponse } from 'axios'

import { Response, Server } from 'miragejs'
import { handleAxiosError } from '~/api/intercepts'
import { API_DEV_URL } from '~/common'
import { LoginResponse } from '~/models/login'

const LOGIN_URI = `${API_DEV_URL}/handle-login`
const LOGOUT_URI = `${API_DEV_URL}/logout`

// qqjf TODO replace with a generated JWT
const FAKE_JWT =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTY4MDE1NDkwMiwiaWF0IjoxNjgwMTE4OTAyLCJhdXRob3JpdGllcyI6WyJBRE1JTiIsIkVNUExPWUVFIl19.RkBDL-0HMIFRmosOv-tCCAVuR33KUZQwLLM1gBwps0k8WbzMajShhNrwk5TlraKbJ_YV2DxZkt3tlMK3FFGodg'

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

export const logout = async (): Promise<void> => {
  await axios.post(LOGOUT_URI).catch((err: AxiosError) => {
    throw Error(handleAxiosError(err))
  })
}

/**
 * Mocked login and logout functions
 */
export const mockedLoginEndpoints = {
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
