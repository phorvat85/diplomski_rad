// Refactored to use GET /admin/user/me instead of decoding the JWT
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { User } from '../api/users'

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

function roleText(r: any) {
  if (!r) return '—'
  if (typeof r === 'string') return r
  return r.name ?? '—'
}

export default function Profile() {
  // Kick off with whatever we have locally for instant paint; then hydrate from /admin/user/me
  const initialUser = getLocalUser() as User | null

  const { data: me, isLoading, isError, error } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get<User>('/worker/user/me')).data,
    // If unauthenticated (401/403), don't retry; for 5xx allow a couple retries
    retry: (failureCount, err: any) => {
      const status = err?.response?.status
      if (status === 401 || status === 403) return false
      return failureCount < 2
    },
    staleTime: 60_000,
  })

  // Sync to localStorage for consistency across pages (e.g., topbar)
  useEffect(() => {
    if (me) {
      const merged = { ...(initialUser || {}), ...me }
      localStorage.setItem('user', JSON.stringify(merged))
    }
  }, [me])

  if (isLoading && !initialUser) {
    return <div className="p-4 text-slate-500">Loading…</div>
  }

  if (isError && !initialUser) {
    const msg = (error as any)?.response?.status === 401 ? 'You’re not logged in.' : 'Failed to load profile.'
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
        <section className="overflow-hidden rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b bg-slate-50 p-3">
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <div className="p-4 text-slate-600">{msg}</div>
        </section>
      </div>
    )
  }

  const user = me || initialUser
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