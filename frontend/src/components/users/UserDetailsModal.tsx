import Modal from '../ui/Modal'
import type { UserRow } from '../../types/entities'

function roleLine(role: UserRow['role']) {
  if (!role) return '—'
  if (typeof role === 'string') return role
  const id = role.id != null ? ` (id: ${role.id})` : ''
  return `${role.name}${id}`
}

function BoolBadge({ value, trueText = 'True', falseText = 'False' }: { value?: boolean; trueText?: string; falseText?: string }) {
  if (value == null) return <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-700">—</span>
  return (
    <span className={`rounded px-2 py-0.5 text-xs ${value ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
      {value ? trueText : falseText}
    </span>
  )
}

export default function UserDetailsModal({
  open, onClose, user,
}: {
  open: boolean
  onClose: () => void
  user: UserRow | null
}) {
  if (!user) return null

  return (
    <Modal open={open} title="User Details" onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto p-1">
        <div className="space-y-4">
          {/* Identity & Role */}
          <div className="rounded-xl border bg-slate-50 p-4">
            <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Details</h5>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <dt className="font-medium text-slate-700">User ID</dt>
              <dd className="col-span-2">{user.id}</dd>

              <dt className="font-medium text-slate-700">Username</dt>
              <dd className="col-span-2 break-words">{user.username || '—'}</dd>

              <dt className="font-medium text-slate-700">Email</dt>
              <dd className="col-span-2 break-words">{user.email || '—'}</dd>

              <dt className="font-medium text-slate-700">Role</dt>
              <dd className="col-span-2">{roleLine(user.role)}</dd>
            </dl>
          </div>

          {/* Account Status */}
          <div className="rounded-xl border bg-slate-50 p-4">
            <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Account Status</h5>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <dt className="font-medium text-slate-700">Enabled</dt>
              <dd className="col-span-2"><BoolBadge value={user.enabled} trueText="Enabled" falseText="Disabled" /></dd>

              <dt className="font-medium text-slate-700">Account Non-Expired</dt>
              <dd className="col-span-2"><BoolBadge value={user.accountNonExpired} /></dd>

              <dt className="font-medium text-slate-700">Credentials Non-Expired</dt>
              <dd className="col-span-2"><BoolBadge value={user.credentialsNonExpired} /></dd>

              <dt className="font-medium text-slate-700">Account Non-Locked</dt>
              <dd className="col-span-2"><BoolBadge value={user.accountNonLocked} /></dd>

              <dt className="font-medium text-slate-700 flex items-center gap-1">
                Failed Login Attempts
              </dt>
              <dd className="col-span-2">{user.failedLoginAttempts ?? 0}</dd>
            </dl>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-800 shadow-sm transition-colors hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}