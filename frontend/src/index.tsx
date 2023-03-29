import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  LoaderFunction,
  redirect,
  RouterProvider,
} from 'react-router-dom'

import { mirageSetup } from '~/api/mirageSetup'
import { URL } from '~/common'
import { Dashboard } from '~/components/dashboard/Dashboard'
import { Error } from '~/components/error/Error'
import { Login } from '~/components/login/Login'
import { isJwtValid } from '~/helpers/jwt'

import './styles/index.css'

/**
 * Page loader for the login page. Redirects to dashboard if the user is already signed in with a valid token.
 */
const loginLoader: LoaderFunction = () => {
  if (isJwtValid()) {
    return redirect(URL.dashboard)
  }

  return null
}

/**
 * Page loader to check whether the user is signed in with a valid token, and redirect to login page otherwise.
 */
const authorizationLoader: LoaderFunction = () => {
  if (!isJwtValid()) {
    return redirect(URL.login)
  }

  return null
}

const router = createBrowserRouter([
  /* Routes accessible by anyone */
  {
    path: URL.login,
    element: <Login />,
    errorElement: <Error />,
    loader: loginLoader,
  },
  {
    path: URL.error,
    element: <Error />,
  },

  /* Routes accessible only to logged-in users*/
  {
    path: URL.dashboard,
    element: <Dashboard />,
    errorElement: <Error />,
    loader: authorizationLoader,
  },

  /* Fallback page (to catch unknown URLs) */
  {
    element: <Error message="Error 404: page not found." />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
mirageSetup()
