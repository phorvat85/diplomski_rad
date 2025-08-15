import type { RoleEntity } from '../../types/entities'

export default function RoleForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  submitting,
}: {
  initial?: Partial<RoleEntity>
  submitLabel: string
  onSubmit: (payload: Partial<RoleEntity>) => void | Promise<void>
  onCancel: () => void
  submitting?: boolean
}) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget as HTMLFormElement)
        await onSubmit({
          id: initial?.id,
          name: String(fd.get('name') || ''),
        })
      }}
      className="space-y-4"
    >
      {initial?.id != null && (
        <div className="rounded-xl border bg-slate-50 p-4">
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Meta</h5>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Role ID</label>
            <div className="rounded border bg-white px-3 py-2">{initial.id}</div>
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-slate-50 p-4">
        <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Basics</h5>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Name</label>
          <input name="name" required defaultValue={initial?.name ?? ''} className="w-full rounded border px-3 py-2" />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-800 shadow-sm transition-colors hover:bg-slate-200">
          Cancel
        </button>
        <button className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-white shadow-sm transition-colors hover:bg-black disabled:opacity-60" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}