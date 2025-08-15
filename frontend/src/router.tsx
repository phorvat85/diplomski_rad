import { createBrowserRouter } from 'react-router-dom'
import { RequireAuth, RoleRoute } from './auth/guards'
import AppShell from './ui/AppShell'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Manager from './pages/Manager'
import Admin from './pages/Admin'

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Home /> },
          { path: 'profile', element: <Profile /> },
          { path: 'settings', element: <Settings /> },

          // Role-protected pages
          { path: 'manager', element: <RoleRoute allowed={['MANAGER', 'ADMIN']} element={<Manager />} /> },
          { path: 'admin',   element: <RoleRoute allowed={['ADMIN']} element={<Admin />} /> },
        ],
      },
    ],
  },
])