import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { hasAnyRole } from '../auth/guards' // reuse the helper

const roleLabel = (r: any) => (typeof r === 'string' ? r : r?.name ?? '')

export default function AppShell() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const doLogout = () => { logout(); nav('/login') }

  const canManager = hasAnyRole(user?.role, ['MANAGER', 'ADMIN'])
  const canAdmin   = hasAnyRole(user?.role, ['ADMIN'])

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
              {user?.username} · {roleLabel(user?.role)}
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