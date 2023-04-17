import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
  RouterProvider,
} from 'react-router-dom'

import { ThemeProvider } from '@mui/material/styles'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import { mirageSetup } from '~/api/mirageSetup'
import {
  GREENHOUSE_VIEW_QUERY,
  GREENHOUSES_ROOT,
  PAGE_URL,
  SensorStationView,
  SS_UUID_PARAM,
  UPLOAD_ROOT,
} from '~/common'
import { ManageAccessPoints } from '~/components/admin/accessPoints/ManageAccessPoints'
import { ManageGreenhouses } from '~/components/admin/greenhouses/ManageGreenhouses'
import { AdminHome } from '~/components/admin/home/AdminHome'
import { AdminLogs } from '~/components/admin/logs/AdminLogs'
import { ManageUsers } from '~/components/admin/users/ManageUsers'
import { Dashboard } from '~/components/dashboard/Dashboard'
import { GettingStarted } from '~/components/gettingStarted/GettingStarted'
import { GreenhouseView } from '~/components/greenhouses/greenhouseView/GreenhouseView'
import { MyGreenhouses } from '~/components/greenhouses/myGreenhouses/MyGreenhouses'
import { Login } from '~/components/login/Login'
import { Error } from '~/components/page/error/Error'
import { MessageSnackbars } from '~/components/page/MessageSnackbars'
import { SnackbarProvider } from '~/contexts/SnackbarContext/SnackbarProvider'
import { isJwtValid } from '~/helpers/jwt'
import '~/styles/index.css'
import { theme } from '~/styles/theme'

import { AppProvider } from './contexts/AppContext/AppProvider'

/**
 * Page loader for the login page. Redirects to dashboard if the user is already signed in with a valid token.
 */
const loginLoader: LoaderFunction = async () => {
  if (isJwtValid() !== null) {
    return redirect(PAGE_URL.dashboard.href)
  }

  return null
}

/**
 * Page loader to check whether the user is signed in with a valid token, and redirect to login page otherwise.
 */
const authorizationLoader: LoaderFunction = async () => {
  if (isJwtValid() === null) {
    return redirect(PAGE_URL.login.href)
  }

  return null
}

/**
 * Page loader to check whether the user is signed in with a valid token, and redirect to login page otherwise.
 */
const greenhousePagesLoader: LoaderFunction = async (
  args: LoaderFunctionArgs
) => {
  const url = new URL(args.request.url)
  const search = new URLSearchParams(url.search)
  const sensorStationView = search.get(GREENHOUSE_VIEW_QUERY)

  // Allow viewing the greenhouses gallery when not logged in
  switch (sensorStationView) {
    case SensorStationView.GALLERY:
      return null
    default:
      return authorizationLoader(args)
  }
}

/** Wrapper for routes that require the user to be logged in to view */
const authRoute = (path: string, element: JSX.Element) => ({
  path: path,
  element: element,
  errorElement: <Error />,
  loader: authorizationLoader,
})

/** Router to manage paths and corresponding components for all frontend pages */
const router = createBrowserRouter([
  // Routes accessible by anyone
  {
    path: PAGE_URL.login.href,
    element: <Login />,
    errorElement: <Error />,
    loader: loginLoader,
  },
  {
    path: `/${UPLOAD_ROOT}/:${SS_UUID_PARAM}`,
    element: <Error />,
    errorElement: <Error />,
  },
  {
    path: PAGE_URL.error.href,
    element: <Error />,
  },
  {
    path: PAGE_URL.gettingStarted.href,
    element: <GettingStarted />,
    errorElement: <Error />,
  },

  // Greenhouse pages
  {
    path: `/${GREENHOUSES_ROOT}/:${SS_UUID_PARAM}`,
    element: <GreenhouseView />,
    errorElement: <Error />,
    loader: greenhousePagesLoader,
  },

  // Routes accessible only to logged-in users
  authRoute(PAGE_URL.adminHome.href, <AdminHome />),
  authRoute(PAGE_URL.adminLogs.href, <AdminLogs />),
  authRoute(PAGE_URL.dashboard.href, <Dashboard />),
  authRoute(PAGE_URL.manageAccessPoints.href, <ManageAccessPoints />),
  authRoute(PAGE_URL.manageGreenhouses.href, <ManageGreenhouses />),
  authRoute(PAGE_URL.manageUsers.href, <ManageUsers />),
  authRoute(PAGE_URL.myGreenhouses.href, <MyGreenhouses />),
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <AppProvider>
          <MessageSnackbars />
          <RouterProvider router={router} />
        </AppProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
)
mirageSetup()
