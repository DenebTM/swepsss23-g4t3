import axios, { AxiosError, AxiosResponse } from 'axios'

import { API_BASE_URL, handleAxiosError } from '~/api/api'
import { LoginResponse } from '~/models/login'

export const handleLogin = (
  username: string,
  password: string
): Promise<AxiosResponse<LoginResponse>> =>
  axios
    .post(`${API_BASE_URL}/handle-login`, {
      username,
      password,
    })
    .then((res) => res)
    .catch((err: AxiosError) => {
      throw Error(handleAxiosError(err))
    })

export const logout = async (): Promise<void> => {
  await axios.post(`${API_BASE_URL}/logout`).catch((err: AxiosError) => {
    throw Error(handleAxiosError(err))
  })
}
