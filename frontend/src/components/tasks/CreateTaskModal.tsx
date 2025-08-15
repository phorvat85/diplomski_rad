import Modal from '../ui/Modal'
import TaskForm from './TaskForm'
import { TaskRow, UserRow } from '../../types/entities'

export default function CreateTaskModal({
  open, onClose, onCreate, users, submitting,
}: {
  open: boolean
  onClose: () => void
  onCreate: (payload: Partial<TaskRow>) => void | Promise<void>
  users: Pick<UserRow, 'id' | 'username'>[]
  submitting?: boolean
}) {
  return (
    <Modal open={open} title="Create Task" onClose={onClose}>
      <TaskForm
        users={users}
        submitLabel="Create"
        onSubmit={onCreate}
        onCancel={onClose}
        emptyAssigneeSends="omit"
        submitting={submitting}
      />
    </Modal>
  )
}