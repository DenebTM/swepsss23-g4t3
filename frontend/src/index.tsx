import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  LoaderFunction,
  RouterProvider,
} from 'react-router-dom'

import { URL } from './common'
import { Error } from './components/error/Error'
import { Login } from './components/login/Login'
import './styles/index.css'

/**
 * TODO: Redirect to dashboard if the user is already signed in with a valid token
 */
const loginLoader: LoaderFunction = () => {
  return null
}

const router = createBrowserRouter([
  // Routes accessible by anyone
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
  {
    path: '*' /* Fallback page (to catch unknown URLs) */,
    element: <Error message="Error 404: page not found." />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
