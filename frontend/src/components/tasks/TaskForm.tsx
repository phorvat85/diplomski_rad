import { TaskRow, UserRow } from '../../types/entities'

type Props = {
  initial?: Partial<TaskRow>
  users: Pick<UserRow, 'id' | 'username'>[]
  submitLabel: string
  onSubmit: (payload: Partial<TaskRow>) => void | Promise<void>
  onCancel: () => void
  emptyAssigneeSends?: 'omit' | 'null'
  submitting?: boolean
}

export default function TaskForm({
  initial,
  users,
  submitLabel,
  onSubmit,
  onCancel,
  emptyAssigneeSends = 'omit',
  submitting,
}: Props) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget as HTMLFormElement)
        const assigneeVal = String(fd.get('assignee') || '')
        const base: Partial<TaskRow> = {
          id: initial?.id,
          title: String(fd.get('title') || ''),
          description: String(fd.get('description') || ''),
          estimation: String(fd.get('estimation') || ''),
        }
        if (assigneeVal) {
          (base as any).assignee = { id: assigneeVal, username: users.find(u => String(u.id) === assigneeVal)?.username || '' }
        } else if (emptyAssigneeSends === 'null') {
          (base as any).assignee = null
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
            <div className="grid gap-2">
              <label className="text-sm font-medium">Task ID</label>
              <div className="rounded border bg-white px-3 py-2">{initial.id}</div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Task Key</label>
              <div className="rounded border bg-white px-3 py-2">{initial.taskKey ?? '—'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Basics */}
      <div className="rounded-xl border bg-slate-50 p-4">
        <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Basics</h5>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <input name="title" required defaultValue={initial?.title ?? ''} className="w-full rounded border px-3 py-2" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" defaultValue={initial?.description ?? ''} className="w-full rounded border px-3 py-2" />
          </div>
        </div>
      </div>

      {/* Estimation & Assignment */}
      <div className="rounded-xl border bg-slate-50 p-4">
        <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Estimation & Assignment</h5>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Estimation</label>
            <input name="estimation" defaultValue={initial?.estimation ?? ''} className="w-full rounded border px-3 py-2" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Assignee</label>
            <select
              name="assignee"
              defaultValue={initial?.assignee?.id != null ? String(initial.assignee.id) : ''}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">Unassigned</option>
              {users.map(u => (
                <option key={u.id} value={String(u.id)}>{u.username}</option>
              ))}
            </select>
          </div>
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