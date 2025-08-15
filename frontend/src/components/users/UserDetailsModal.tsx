import Modal from '../ui/Modal'
import type { UserRow } from '../../types/entities'

function roleLine(role: UserRow['role']) {
  if (!role) return '—'
  if (typeof role === 'string') return role
  const id = role.id != null ? ` (id: ${role.id})` : ''
  return `${role.name}${id}`
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
      <div className="space-y-4">
        {/* Single simple section */}
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

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-800 shadow-sm transition-colors hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}