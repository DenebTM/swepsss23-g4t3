import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

import { API_DEV_URL, PAGE_URL } from '~/common'
import { getJwt } from '~/helpers/jwt'

/**
 * Represents the input types of the axios functions axios.get and axios.delete
 */
type GetOrDel = 'GetOrDel'

/**
 * Represents the input types of the axios functions axios.post and axios.put
 */
type PostOrPut = 'PostOrPut'

/**
 * A union of two types of inputs supported by axios
 */
type RestVariant = GetOrDel | PostOrPut

/**
 * The type of the second argument to the axios request function corresponding to R
 * @template R The rest variant (GET/DELETE or PUT/POST)
 * @template D The request body type if applicable
 */
type WrapperArg2<R = RestVariant, D = unknown> = R extends GetOrDel
  ? AxiosRequestConfig<D> | undefined
  : D | undefined

/**
 * The type of the third argument to the axios request function corresponding to R
 * @template R The rest variant (GET/DELETE or PUT/POST)
 * @template D The request body type for PUT/POST functions, and unused for GET/DELETE functions
 */
type WrapperArg3<R = RestVariant, D = unknown> = R extends GetOrDel
  ? undefined
  : AxiosRequestConfig<D> | undefined

/**
 * Custom wrapper to add the API base URL and return the awaited response from an AxiosResponse<T> object.
 * The reason for this wrapper function is to add the API base url and extract the return response in only one location.
 * The custom typing is because axios.get and axios.delete take only 2 arguments, whereas axios.post and axios.put take 3 arguments (where the second arument of each is differently typed).
 * @template R The rest variant corresponding to GET/DELETE and POST/PUT requests
 * @template T The expected data return type
 * @template D The request body type
 * @returns {Promise<T>}
 */
const axiosWrapper = async <R extends RestVariant, T = unknown, D = unknown>(
  axiosFun: (
    url: string,
    arg2: WrapperArg2<R, D>,
    arg3: WrapperArg3<R, D>
  ) => Promise<AxiosResponse<T, D>>,
  url: string,
  arg2: WrapperArg2<R, D>,
  arg3: WrapperArg3<R, D> = undefined,
  addApiPrefix = true
): Promise<T> => {
  const apiUrl = addApiPrefix
    ? `${API_DEV_URL}/api${url}`
    : `${API_DEV_URL}${url}`

  // Return axios response data
  return axiosFun(apiUrl, arg2, arg3)
    .then((res: AxiosResponse<T, D>) => res.data)
    .catch((err: AxiosError) => {
      if (err.response && err.response.status === 401) {
        // If unauthorised, redirect to login page
        window.location.pathname = PAGE_URL.login.href
      }
      // Otherwise, extract message from AxiosError object and throw it
      throw Error(handleAxiosError(err))
    })
}

/**
 * Upwrap an axios error object to extract a string message to display if possible.
 * @param axiosErr The AxiosError object to unwrap
 */
export const handleAxiosError = (err: AxiosError): string => {
  // The backend sometimes returns a string error and sometimes returns an object. The
  // following block catches and throws errors for both cases.
  if (err.response && Boolean(err.response.data)) {
    const errData: unknown = err.response.data
    if (typeof errData === 'string') {
      return errData
    } else if (
      typeof errData === 'object' &&
      errData !== null &&
      'error' in errData &&
      typeof errData.error === 'string'
    ) {
      return errData.error
    }
  }

  // Get message from error if available
  if (typeof err.message == 'string') {
    return err.message
  }

  return String(err)
}

// Append Authorization token to existing headers, or create new headers on config
const authConfig = <D = unknown>(
  config?: AxiosRequestConfig<D>
): AxiosRequestConfig<D> => {
  if (typeof config === 'undefined') {
    config = {}
  }

  // Load JWT from cookies (and send an empty token to the backend otherwise)
  const jwt: string = getJwt() ?? ''

  return {
    ...config,
    ...{
      // Add Authorization header to existing headers if there are any
      headers: Object.assign(config.headers ? config.headers : {}, {
        Authorization: 'Bearer ' + jwt,
      }),
    },
  }
}

/**
 * Custom wrapper for axios.delete to reduce boilerplate code
 * @template T The expected data return type
 * @returns {Promise<T>}
 */
export const _delete = <T = unknown, D = unknown>(
  url: string,
  config?: AxiosRequestConfig<D>
): Promise<T> =>
  axiosWrapper<GetOrDel, T, D>(axios.delete, url, authConfig(config))

/**
 * Custom wrapper for axios.get to reduce boilerplate code
 * @template T The expected data return type
 * @returns {Promise<T>}
 */
export const _get = <T = unknown, D = unknown>(
  url: string,
  config?: AxiosRequestConfig<D>,
  addApiPrefix = true
): Promise<T> =>
  axiosWrapper<GetOrDel, T, D>(
    axios.get,
    url,
    authConfig(config),
    undefined,
    addApiPrefix
  )

/**
 * Custom wrapper for axios.post to reduce boilerplate code
 * @template T The expected data return type
 * @returns {Promise<T>}
 */
export const _post = <T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>
): Promise<T> =>
  axiosWrapper<PostOrPut, T, D>(axios.post, url, data, authConfig(config))

/**
 * Custom wrapper for axios.put to reduce boilerplate code
 * @template T The expected data return type
 * @returns {Promise<T>}
 */
export const _put = <T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>
): Promise<T> =>
  axiosWrapper<PostOrPut, T, D>(axios.put, url, data, authConfig(config))
