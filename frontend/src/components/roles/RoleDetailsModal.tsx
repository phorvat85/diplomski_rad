import Modal from '../ui/Modal'
import type { RoleEntity } from '../../types/entities'

export default function RoleDetailsModal({
  open, onClose, role,
}: {
  open: boolean
  onClose: () => void
  role: RoleEntity | null
}) {
  if (!role) return null
  return (
    <Modal open={open} title="Role Details" onClose={onClose}>
      <div className="space-y-4">
        <div className="rounded-xl border bg-slate-50 p-4">
          <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Details</h5>
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <dt className="font-medium text-slate-700">Role ID</dt>
            <dd className="col-span-2">{role.id}</dd>

            <dt className="font-medium text-slate-700">Name</dt>
            <dd className="col-span-2">{role.name}</dd>
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