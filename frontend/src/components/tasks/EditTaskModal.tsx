import { useState } from 'react'
import Modal from '../ui/Modal'
import TaskForm from './TaskForm'
import type { TaskRow, UserRow } from '../../types/entities'

export default function EditTaskModal({
  open,
  onClose,
  task,
  onSave,
  users,
  submitting,
}: {
  open: boolean
  onClose: () => void
  task: TaskRow | null
  onSave: (payload: Partial<TaskRow>) => void | Promise<void>
  users: Pick<UserRow, 'id' | 'username'>[]
  submitting?: boolean
}) {
  const [saving, setSaving] = useState(false)

  if (!task) return null

  const handleSubmit = async (payload: Partial<TaskRow>) => {
    if (saving) return
    try {
      setSaving(true)
      await Promise.resolve(onSave(payload)) // supports sync or async onSave
      onClose() // close only if save succeeded
    } catch (e) {
      // keep modal open so the user can fix input
      // optionally surface error inside TaskForm if supported
      // eslint-disable-next-line no-console
      console.error('Failed to save task', e)
    } finally {
      setSaving(false)
    }
  }

  const busy = Boolean(submitting || saving)

  return (
    <Modal open={open} title="Edit Task" onClose={onClose}>
      <TaskForm
        initial={task}
        users={users}
        submitLabel={busy ? 'Saving…' : 'Save'}
        onSubmit={handleSubmit}
        onCancel={onClose}
        emptyAssigneeSends="null"
        submitting={busy}
      />
    </Modal>
  )
}