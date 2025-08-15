import Modal from '../ui/Modal'
import type { TaskRow } from '../../types/entities'

export default function TaskDetailsModal({
  open, onClose, task,
}: {
  open: boolean
  onClose: () => void
  task: TaskRow | null
}) {
  if (!task) return null
  const assigneeText = task.assignee ? `${task.assignee.username} (id: ${task.assignee.id})` : '—'

  return (
    <Modal open={open} title="Task Details" onClose={onClose}>
      <div className="space-y-4">
        {/* Overview */}
        <div className="rounded-xl border bg-slate-50 p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h4 className="text-base font-semibold text-slate-900">{task.title || 'Untitled task'}</h4>
              <p className="text-xs text-slate-500">Task ID: {task.id}</p>
            </div>
          </div>
        </div>

        {/* Details (now includes Task Key) */}
        <div className="rounded-xl border bg-slate-50 p-4">
          <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Details</h5>
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <dt className="font-medium text-slate-700">Task Key</dt>
            <dd className="col-span-2">{task.taskKey ?? '—'}</dd>

            <dt className="font-medium text-slate-700">Description</dt>
            <dd className="col-span-2 whitespace-pre-wrap break-words">{task.description || '—'}</dd>

            <dt className="font-medium text-slate-700">Estimation</dt>
            <dd className="col-span-2">{task.estimation || '—'}</dd>

            <dt className="font-medium text-slate-700">Assignee</dt>
            <dd className="col-span-2">{assigneeText}</dd>
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