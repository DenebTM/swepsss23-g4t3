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
import useMediaQuery from '@mui/material/useMediaQuery'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import Cookies from 'universal-cookie'
import { mirageSetup, MOCK_API } from '~/api/mirageSetup'
import {
  API_DEV_URL,
  GREENHOUSE_VIEW_QUERY,
  GREENHOUSES_ROOT,
  PAGE_URL,
  SensorStationView,
  SS_UUID_PARAM,
  UPLOAD_ROOT,
} from '~/common'
import { ManageAccessPoints } from '~/components/admin/accessPoints/ManageAccessPoints'
import { AdminLogs } from '~/components/admin/adminLogs/AdminLogs'
import { ManageGreenhouses } from '~/components/admin/greenhouses/ManageGreenhouses'
import { AdminHome } from '~/components/admin/home/AdminHome'
import { ManageUsers } from '~/components/admin/users/ManageUsers'
import { Dashboard } from '~/components/dashboard/Dashboard'
import { GettingStarted } from '~/components/gettingStarted/GettingStarted'
import { GreenhouseView } from '~/components/greenhouses/greenhouseView/GreenhouseView'
import { MyGreenhouses } from '~/components/greenhouses/myGreenhouses/MyGreenhouses'
import { Login } from '~/components/login/Login'
import { Error } from '~/components/page/error/Error'
import { MessageSnackbars } from '~/components/page/Snackbar/MessageSnackbars'
import { SnackbarProvider } from '~/contexts/SnackbarContext/SnackbarProvider'
import { isUserLoggedIn } from '~/helpers/jwt'
import '~/styles/index.css'
import { generateTheme } from '~/styles/theme'

import { PhotoUpload } from './components/photoUpload/PhotoUpload'
import { AppProvider } from './contexts/AppContext/AppProvider'
import {
  ColourMode,
  ColourModeContext,
  IColourModeContext,
} from './contexts/ColourModeContext/ColourModeContext'

/**
 * Page loader for the login page. Redirects to dashboard if the user is already signed in with a valid token.
 */
const loginLoader: LoaderFunction = async () => {
  if (isUserLoggedIn()) {
    return redirect(PAGE_URL.dashboard.href)
  }

  return null
}

/**
 * Page loader to check whether the user is signed in with a valid token, and redirect to login page otherwise.
 */
const authorizationLoader: LoaderFunction = async () => {
  if (!isUserLoggedIn()) {
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
  return sensorStationView === SensorStationView.GALLERY
    ? null
    : authorizationLoader(args)
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
    path: `/${UPLOAD_ROOT}`,
    element: <PhotoUpload />,
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

// Create app as a React component so that hooks can be used to determine the theme
const App: React.FC = () => {
  // automatic dark theme
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  // remember theme mode using cookie
  const THEME_MODE = 'THEME_MODE'
  const cookies = new Cookies()

  const [activeMode, setActiveMode] = React.useState<ColourMode>(
    cookies.get<ColourMode>(THEME_MODE) ?? 'auto'
  )

  // manual theme override
  const colourMode = React.useMemo<IColourModeContext>(
    () => ({
      activeMode,
      changeColourMode: () => {
        const nextColourMode = prefersDarkMode
          ? // browser prefers dark mode: auto->light->dark->auto
            activeMode === 'auto'
            ? 'light'
            : activeMode === 'light'
            ? 'dark'
            : 'auto'
          : // browser prefers light mode: auto->dark->light->auto
          activeMode === 'auto'
          ? 'dark'
          : activeMode === 'dark'
          ? 'light'
          : 'auto'

        setActiveMode(nextColourMode)
        cookies.set(THEME_MODE, nextColourMode, { sameSite: 'strict' })
      },
    }),
    [activeMode, prefersDarkMode]
  )

  // generate theme based on active mode
  const theme = React.useMemo(() => {
    if (activeMode == 'auto')
      return generateTheme(prefersDarkMode ? 'dark' : 'light')

    return generateTheme(activeMode)
  }, [activeMode, prefersDarkMode])

  return (
    <React.StrictMode>
      <ColourModeContext.Provider value={colourMode}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <AppProvider>
              <MessageSnackbars />
              <RouterProvider router={router} />
            </AppProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </ColourModeContext.Provider>
    </React.StrictMode>
  )
}

// Render the app in the browser
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)

// enable the mock API only when run with `yarn mock`
mirageSetup(import.meta.env.DEV && API_DEV_URL === '' ? MOCK_API : '')
