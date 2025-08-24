import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'

const btnSoft =
  'inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-800 shadow-sm transition-colors hover:bg-slate-200'
const btnPrimary =
  'inline-flex items-center rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-white shadow-sm transition-colors hover:bg-black'

// Extractors that never fall back to numeric id
const pickUsername = (u: any) => {
  const v = u?.username ?? u?.userName ?? u?.name ?? ''
  const s = typeof v === 'number' ? '' : String(v).trim()
  return s && /^\d+$/.test(s) && String(u?.id ?? '') === s ? '' : s
}
const pickEmail = (u: any) => String(u?.email ?? u?.emailAddress ?? '').trim()

export default function Settings() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user: authUser, updateUser } = useAuth()

  // Always populate from /worker/user/me
  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/worker/user/me')).data,
    // ensure it's considered stale right away so refetches happen when needed
    staleTime: 0,
    refetchOnMount: 'always',
    retry: 1,
  })

  // Form state
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [profileMsg, setProfileMsg] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  // Seed when /me changes
  useEffect(() => {
    const src = me ?? authUser ?? null
    if (!src) return
    setUsername(pickUsername(src))
    setEmail(pickEmail(src))
  }, [me, authUser])

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMsg('')
    try {
      setSavingProfile(true)

      const id = (me ?? authUser as any)?.id
      const body: any = { username, email }
      if (id != null) body.id = id

      await api.put('/worker/user/update/basic', body, {
        validateStatus: (s) => (s >= 200 && s < 300) || s === 302,
      })

      // 1) update in-memory auth user immediately
      updateUser({ username, email })

      // 2) update React Query cache immediately
      queryClient.setQueryData(['me'], (old: any) => ({ ...(old ?? {}), username, email }))

      // 3) refetch in the background so Profile shows server-truth too
      queryClient.invalidateQueries({ queryKey: ['me'] })

      // 4) navigate instantly
      navigate('/profile', { replace: true })
    } catch (err: any) {
      setProfileMsg(err?.response?.data?.message || err?.message || 'Failed to save profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdMsg('')
    if (newPassword !== repeatPassword) {
      setPwdMsg('Passwords do not match.')
      return
    }
    try {
      setSavingPassword(true)
      const id = (me ?? authUser as any)?.id
      const body: any = { oldPassword: currentPassword, newPassword }
      if (id != null) body.id = id

      await api.put('/worker/user/update/password', body, {
        validateStatus: (s) => (s >= 200 && s < 300) || s === 302,
      })

      // force a fresh /me fetch in case backend mutates any fields
      queryClient.invalidateQueries({ queryKey: ['me'] })

      navigate('/profile', { replace: true })
    } catch (err: any) {
      setPwdMsg(err?.response?.data?.message || err?.message || 'Failed to change password.')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
      <div className="grid grid-cols-1 gap-6">
        {/* Edit Profile */}
        <section className="overflow-hidden rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b bg-slate-50 p-3">
            <h2 className="text-lg font-semibold">Edit Profile</h2>
          </div>
          <div className="p-4">
            <form onSubmit={onSaveProfile} className="space-y-4">
              <div className="rounded-xl border bg-slate-50 p-4">
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Basics</h5>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Username</label>
                    <input
                      className="w-full rounded border px-3 py-2"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={savingProfile}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      className="w-full rounded border px-3 py-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={savingProfile}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <span className="self-center text-xs text-slate-500">
                  Saving via <code>/worker/user/update/basic</code>
                </span>
                <button className={btnPrimary} disabled={savingProfile}>
                  {savingProfile ? 'Saving…' : 'Save Profile'}
                </button>
              </div>

              {!!profileMsg && <div className="text-sm text-slate-700">{profileMsg}</div>}
            </form>
          </div>
        </section>

        {/* Password */}
        <section className="overflow-hidden rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b bg-slate-50 p-3">
            <h2 className="text-lg font-semibold">Password</h2>
          </div>
          <div className="p-4">
            <form onSubmit={onChangePassword} className="space-y-4">
              <div className="rounded-xl border bg-slate-50 p-4">
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Reset Password</h5>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <input
                      type="password"
                      className="w-full rounded border px-3 py-2"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="current-password"
                      disabled={savingPassword}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">New Password</label>
                    <input
                      type="password"
                      className="w-full rounded border px-3 py-2"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={savingPassword}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Repeat New Password</label>
                    <input
                      type="password"
                      className="w-full rounded border px-3 py-2"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={savingPassword}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className={btnSoft}
                  type="reset"
                  onClick={() => {
                    setCurrentPassword('')
                    setNewPassword('')
                    setRepeatPassword('')
                  }}
                  disabled={savingPassword}
                >
                  Clear
                </button>
                <button className={btnPrimary} type="submit" disabled={savingPassword}>
                  {savingPassword ? 'Updating…' : 'Change Password'}
                </button>
              </div>

              {!!pwdMsg && <div className="text-sm text-slate-700">{pwdMsg}</div>}
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}