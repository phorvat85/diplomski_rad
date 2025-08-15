import { useMemo, useState } from 'react'
import { useUsersCrud } from '../hooks/useUsersCrud'
import { changePassword } from '../api/auth'

const btnSoft    = 'inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-800 shadow-sm transition-colors hover:bg-slate-200'
const btnPrimary = 'inline-flex items-center rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-white shadow-sm transition-colors hover:bg-black'

function getCurrentUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function hasAnyRole(role: any, allowed: string[]) {
  const val = typeof role === 'string' ? role : role?.name ?? ''
  const upper = val.toUpperCase()
  return allowed.some(a => upper === a || upper === `ROLE_${a}`)
}

export default function Settings() {
  const { updateUser, updatingUser } = useUsersCrud()

  const currentUser = useMemo(() => getCurrentUser(), [])
  const canAdminUpdate = hasAnyRole(currentUser?.role, ['ADMIN', 'MANAGER'])

  // Edit profile state
  const [username, setUsername] = useState<string>(currentUser?.username ?? '')
  const [email, setEmail] = useState<string>(currentUser?.email ?? '')
  const [profileMsg, setProfileMsg] = useState<string>('')

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [pwdMsg, setPwdMsg] = useState<string>('')

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMsg('')
    try {
      if (!currentUser?.id) throw new Error('Missing current user id.')
      // Use existing admin update endpoint; adjust if you add a dedicated /me endpoint
      await new Promise<void>((resolve, reject) => {
        updateUser(
          { id: currentUser.id, username, email } as any,
          // @ts-ignore — TanStack’s mutate can take callbacks if using mutate instead of mutateAsync
          { onSuccess: resolve, onError: reject }
        )
      })

      // keep localStorage in sync for Profile page
      const updated = { ...currentUser, username, email }
      localStorage.setItem('user', JSON.stringify(updated))
      setProfileMsg('Profile saved.')
    } catch (err: any) {
      setProfileMsg(err?.message || 'Failed to save profile.')
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
      await changePassword({ currentPassword, newPassword })
      setPwdMsg('Password updated.')
      setCurrentPassword('')
      setNewPassword('')
      setRepeatPassword('')
    } catch (err: any) {
      setPwdMsg(err?.message || 'Failed to change password.')
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
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      className="w-full rounded border px-3 py-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {!canAdminUpdate && (
                  <span className="self-center text-xs text-slate-500">
                    Note: saving uses the admin update endpoint. If your backend exposes a /me update, tell me and I’ll wire it.
                  </span>
                )}
                <button className={btnPrimary} disabled={updatingUser}>
                  {updatingUser ? 'Saving…' : 'Save Profile'}
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
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button className={btnSoft} type="reset" onClick={() => { setCurrentPassword(''); setNewPassword(''); setRepeatPassword(''); }}>
                  Clear
                </button>
                <button className={btnPrimary} type="submit">Change Password</button>
              </div>

              {!!pwdMsg && <div className="text-sm text-slate-700">{pwdMsg}</div>}
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}