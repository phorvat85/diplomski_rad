import Modal from '../ui/Modal'
import TaskForm from './TaskForm'
import { TaskRow, UserRow } from '../../types/entities'

export default function EditTaskModal({
  open, onClose, task, onSave, users, submitting,
}: {
  open: boolean
  onClose: () => void
  task: TaskRow | null
  onSave: (payload: Partial<TaskRow>) => void | Promise<void>
  users: Pick<UserRow, 'id' | 'username'>[]
  submitting?: boolean
}) {
  if (!task) return null
  return (
    <Modal open={open} title="Edit Task" onClose={onClose}>
      <TaskForm
        initial={task}
        users={users}
        submitLabel="Save"
        onSubmit={onSave}
        onCancel={onClose}
        emptyAssigneeSends="null"
        submitting={submitting}
      />
    </Modal>
  )
}