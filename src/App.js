import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import * as jwtDecode from 'jwt-decode'  // <-- ici
import Dashboard from './views/dashboard/Dashboard'
import './scss/style.scss'
import './scss/examples.scss'
import DashboardTest from './views/dashboard/DashboardTest'
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) return
    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const token = localStorage.getItem('token')
  let isTokenValid = false

  if (token) {
    try {
      const decoded = jwtDecode.default(token)  // <-- ici
      const now = Date.now() / 1000
      isTokenValid = decoded.exp > now
      if (!isTokenValid) localStorage.removeItem('token')
    } catch (error) {
      localStorage.removeItem('token')
    }
  }

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
           <Route path="*" element={<Navigate to="/login" replace={true} />} />
          <Route path="/login" element={isTokenValid ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
        <Route path="/dashboard" element={isTokenValid ? <DashboardTest  /> : <Navigate to="/login" replace />} />
  <Route path="/*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
