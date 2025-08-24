import { RoleEntity, UserRow } from '../../types/entities'
import { useState } from 'react'

type Props = {
  initial?: Partial<UserRow>
  roles: RoleEntity[]
  includePassword?: boolean
  submitLabel: string
  onSubmit: (payload: Partial<UserRow> & { password?: string; role: { id: number } }) => void | Promise<void>
  onCancel: () => void
  submitting?: boolean
}

export default function UserForm({
  initial,
  roles,
  includePassword = false,
  submitLabel,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const roleIdDefault = (() => {
    const r = initial?.role as any
    if (r && typeof r === 'object' && r.id != null) return String(r.id)
    if (typeof r === 'string') {
      const found = roles.find(x => x.name === r)
      if (found) return String(found.id)
    }
    return roles[0] ? String(roles[0].id) : ''
  })()

  const [enabledPreview, setEnabledPreview] = useState<boolean>(initial?.enabled ?? true)
  const [failedPreview, setFailedPreview] = useState<number>(initial?.failedLoginAttempts ?? 0)

  return (
    <div className="max-h-[80vh] overflow-y-auto p-2">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget as HTMLFormElement)

          const roleIdStr = String(fd.get('roleId') || roleIdDefault)

          const readBool = (name: string, _fallback: boolean) => {
            const raw = fd.get(name)
            return raw != null
          }

          const enabled = readBool('enabled', initial?.enabled ?? true)
          const accountNonExpired = readBool('accountNonExpired', initial?.accountNonExpired ?? true)
          const credentialsNonExpired = readBool('credentialsNonExpired', initial?.credentialsNonExpired ?? true)
          const accountNonLocked = readBool('accountNonLocked', initial?.accountNonLocked ?? true)

          const base: any = {
            id: initial?.id,
            username: String(fd.get('username') || initial?.username || ''),
            email: String(fd.get('email') || initial?.email || ''),
            role: roleIdStr ? { id: Number(roleIdStr) } : undefined,
            enabled,
            accountNonExpired,
            credentialsNonExpired,
            accountNonLocked,
          }

          if (includePassword) base.password = String(fd.get('password') || '')

          if (initial?.enabled === false && enabled === true) {
            base.failedLoginAttempts = 0
          }

          await onSubmit(base)
        }}
        className="space-y-4"
      >
        {/* Meta (only on edit) */}
        {initial?.id != null && (
          <div className="rounded-xl border bg-slate-50 p-4">
            <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Meta</h5>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-1">
                <label className="text-sm font-medium">User ID</label>
                <div className="rounded border bg-white px-3 py-2">{initial.id}</div>
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-medium flex items-center gap-1">
                  Failed Login Attempts
                  <span className="group relative cursor-pointer text-slate-500">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-xs">?</span>
                    <span className="absolute left-1/2 top-full z-10 mt-1 hidden w-52 -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-xs text-white group-hover:block shadow-lg">
                      This field is read-only. It resets to 0 when you re-enable the user.
                    </span>
                  </span>
                </label>
                <div className="rounded border bg-white px-3 py-2">{failedPreview}</div>
              </div>
            </div>
          </div>
        )}

        {/* Identity */}
        <div className="rounded-xl border bg-slate-50 p-4">
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Identity</h5>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Username</label>
              <input name="username" required defaultValue={initial?.username ?? ''} className="w-full rounded border px-3 py-2" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <input name="email" type="email" required defaultValue={initial?.email ?? ''} className="w-full rounded border px-3 py-2" />
            </div>
          </div>
        </div>

        {/* Security (create only) */}
        {includePassword && (
          <div className="rounded-xl border bg-slate-50 p-4">
            <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Security</h5>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Password</label>
              <input name="password" type="password" required className="w-full rounded border px-3 py-2" />
            </div>
          </div>
        )}

        {/* Role */}
        <div className="rounded-xl border bg-slate-50 p-4">
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Role</h5>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Role</label>
            <select name="roleId" defaultValue={roleIdDefault} className="w-full rounded border px-3 py-2">
              {roles.map(r => (<option key={r.id} value={String(r.id)}>{r.name}</option>))}
            </select>
          </div>
        </div>

        {/* Account Status */}
        <div className="rounded-xl border bg-slate-50 p-4">
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Account Status</h5>

          <div className="grid gap-3 md:grid-cols-2">
            {/* Enabled */}
            <div className="flex items-center justify-between rounded-lg border bg-white p-3">
              <div className="mr-4">
                <div className="text-sm font-medium">Enabled</div>
                <div className="text-xs text-slate-500">Allow login</div>
              </div>
              <label className="relative inline-flex h-6 w-12 cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="enabled"
                  defaultChecked={enabledPreview}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setEnabledPreview(checked)
                    if (checked) {
                      setFailedPreview(0)
                    } else {
                      setFailedPreview(initial?.failedLoginAttempts ?? 0)
                    }
                  }}
                  className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-slate-900"></span>
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-6"></span>
              </label>
            </div>

            {/* Account Non-Expired */}
            <div className="flex items-center justify-between rounded-lg border bg-white p-3">
              <div className="mr-4">
                <div className="text-sm font-medium">Account Non-Expired</div>
                <div className="text-xs text-slate-500">Account is still valid</div>
              </div>
              <label className="relative inline-flex h-6 w-12 cursor-pointer items-center">
                <input type="checkbox" name="accountNonExpired" defaultChecked={(initial?.accountNonExpired ?? true)} className="peer sr-only" />
                <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-slate-900"></span>
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-6"></span>
              </label>
            </div>

            {/* Credentials Non-Expired */}
            <div className="flex items-center justify-between rounded-lg border bg-white p-3">
              <div className="mr-4">
                <div className="text-sm font-medium">Credentials Non-Expired</div>
                <div className="text-xs text-slate-500">Password/API keys valid</div>
              </div>
              <label className="relative inline-flex h-6 w-12 cursor-pointer items-center">
                <input type="checkbox" name="credentialsNonExpired" defaultChecked={(initial?.credentialsNonExpired ?? true)} className="peer sr-only" />
                <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-slate-900"></span>
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-6"></span>
              </label>
            </div>

            {/* Account Non-Locked */}
            <div className="flex items-center justify-between rounded-lg border bg-white p-3">
              <div className="mr-4">
                <div className="text-sm font-medium">Account Non-Locked</div>
                <div className="text-xs text-slate-500">Not locked due to failures</div>
              </div>
              <label className="relative inline-flex h-6 w-12 cursor-pointer items-center">
                <input type="checkbox" name="accountNonLocked" defaultChecked={(initial?.accountNonLocked ?? true)} className="peer sr-only" />
                <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-slate-900"></span>
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-6"></span>
              </label>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">Re-enabling a user will reset failed login attempts to 0 on save.</p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-800 shadow-sm transition-colors hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-white shadow-sm transition-colors hover:bg-black disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? 'Saving…' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}