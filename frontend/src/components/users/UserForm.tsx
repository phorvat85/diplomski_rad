import { RoleEntity, UserRow } from '../../types/entities'

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
    const r = initial?.role
    if (r && typeof r === 'object' && r.id != null) return String(r.id)
    if (typeof r === 'string') {
      const found = roles.find(x => x.name === r)
      if (found) return String(found.id)
    }
    return roles[0] ? String(roles[0].id) : ''
  })()

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget as HTMLFormElement)
        const roleIdStr = String(fd.get('roleId') || roleIdDefault)
        const base: any = {
          id: initial?.id,
          username: String(fd.get('username') || initial?.username || ''),
          email: String(fd.get('email') || initial?.email || ''),
          role: roleIdStr ? { id: Number(roleIdStr) } : undefined,
        }
        if (includePassword) base.password = String(fd.get('password') || '')
        await onSubmit(base)
      }}
      className="space-y-4"
    >
      {/* Meta (only on edit) */}
      {initial?.id != null && (
        <div className="rounded-xl border bg-slate-50 p-4">
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Meta</h5>
          <div className="grid gap-2">
            <label className="text-sm font-medium">User ID</label>
            <div className="rounded border bg-white px-3 py-2">{initial.id}</div>
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
  )
}