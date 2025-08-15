// src/pages/Profile.tsx
import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { listUsers } from '../api/users'

const btnPrimary =
  'inline-flex items-center rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-white shadow-sm transition-colors hover:bg-black'

function getLocalUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function getToken(): string | null {
  return localStorage.getItem('token') || localStorage.getItem('accessToken')
}
function decodeJwt(token: string): any | null {
  try {
    const [, payload] = token.split('.')
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}
function normalizeRole(r: any): string {
  if (!r) return ''
  if (typeof r === 'string') return r
  return r.name ?? ''
}
function hasAnyRole(role: any, allowed: string[]) {
  const val = normalizeRole(role).toUpperCase()
  return allowed.some(a => val === a || val === `ROLE_${a}`)
}
function roleText(r: any) {
  if (!r) return '—'
  if (typeof r === 'string') return r
  return r.name ?? '—'
}

export default function Profile() {
  const localUser = useMemo(() => getLocalUser(), [])
  const token = useMemo(() => getToken(), [])
  const canHydrateFromUsers = hasAnyRole(localUser?.role, ['ADMIN', 'MANAGER'])

  // Hydrate user info without a /me endpoint
  const { data: hydratedUser, isLoading } = useQuery({
    queryKey: ['profile-hydrate', localUser?.username],
    enabled: !!localUser, // only run if we at least have a username
    queryFn: async () => {
      // start with local
      let base: any = { ...(localUser || {}) }

      // 1) try JWT
      if (token) {
        const claims = decodeJwt(token)
        if (claims && typeof claims === 'object') {
          const fromJwt = {
            id: claims.id ?? claims.userId ?? claims.uid ?? base.id,
            username: claims.username ?? claims.sub ?? base.username,
            email: claims.email ?? base.email,
            role: claims.role ?? base.role,
          }
          base = { ...base, ...fromJwt }
        }
      }

      // 2) if admin/manager, look up from users list by username to get id/email exactly
      if (canHydrateFromUsers && base?.username) {
        try {
          const users = await listUsers()
          const match =
            users.find((u: any) => String(u.username).toLowerCase() === String(base.username).toLowerCase()) ||
            null
          if (match) {
            base = { ...base, id: match.id ?? base.id, email: match.email ?? base.email, role: match.role ?? base.role }
          }
        } catch {
          // ignore — maybe not authorized; keep what we have
        }
      }

      return base
    },
    staleTime: 60_000,
  })

  // Sync improved info back to localStorage for consistency across pages
  useEffect(() => {
    if (hydratedUser) {
      const merged = { ...(localUser || {}), ...hydratedUser }
      localStorage.setItem('user', JSON.stringify(merged))
    }
  }, [hydratedUser]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!localUser && isLoading) {
    return <div className="p-4 text-slate-500">Loading…</div>
  }

  const user = hydratedUser || localUser
  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
        <section className="overflow-hidden rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b bg-slate-50 p-3">
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <div className="p-4 text-slate-600">You’re not logged in.</div>
        </section>
      </div>
    )
  }

  const displayId = user.id && user.id !== 'me' ? user.id : '—'

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
      <section className="overflow-hidden rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b bg-slate-50 p-3">
          <h2 className="text-lg font-semibold">Profile</h2>
          <Link to="/settings" className={btnPrimary}>Settings</Link>
        </div>

        <div className="p-4">
          <div className="rounded-xl border bg-slate-50 p-4">
            <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Details</h5>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <dt className="font-medium text-slate-700">User ID</dt>
              <dd className="col-span-2">{displayId}</dd>

              <dt className="font-medium text-slate-700">Username</dt>
              <dd className="col-span-2 break-words">{user.username ?? '—'}</dd>

              <dt className="font-medium text-slate-700">Email</dt>
              <dd className="col-span-2 break-words">{user.email ?? '—'}</dd>

              <dt className="font-medium text-slate-700">Role</dt>
              <dd className="col-span-2">{roleText(user.role)}</dd>
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}