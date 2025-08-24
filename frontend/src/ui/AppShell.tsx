import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { hasAnyRole } from '../auth/guards'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

const roleLabel = (r: any) => (typeof r === 'string' ? r : r?.name ?? '')

export default function AppShell() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const doLogout = () => { logout(); nav('/login') }

  // Prefer /user/me over anything derived from the JWT
  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/user/me')).data, // <-- your controller path
    // If unauthenticated, don’t spam retries
    retry: (failureCount, err: any) => {
      const s = err?.response?.status
      if (s === 401 || s === 403) return false
      return failureCount < 1
    },
    staleTime: 60_000,
  })

  // Use /me if available, fallback to context
  const headerUser = me ?? user

  const canManager = hasAnyRole(headerUser?.role, ['MANAGER', 'ADMIN'])
  const canAdmin   = hasAnyRole(headerUser?.role, ['ADMIN'])

  // (Optional) keep localStorage 'user' in sync for other screens
  useEffect(() => {
    if (me) {
      const current = (() => {
        try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
      })()
      localStorage.setItem('user', JSON.stringify({ ...(current || {}), ...me }))
    }
  }, [me])

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <nav className="flex gap-4">
            <NavLink to="/" end>Home</NavLink>
            {canManager && <NavLink to="/manager">Manager</NavLink>}
            {canAdmin && <NavLink to="/admin">Admin</NavLink>}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/profile" className="text-sm">
              {(headerUser?.username ?? '—')} · {roleLabel(headerUser?.role)}
            </Link>
            <button onClick={doLogout} className="px-3 py-1 rounded bg-black text-white">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  )
}