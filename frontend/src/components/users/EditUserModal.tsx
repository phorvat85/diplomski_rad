import Modal from '../ui/Modal'
import UserForm from './UserForm'
import { RoleEntity, UserRow } from '../../types/entities'

export default function EditUserModal({
  open, onClose, user, roles, onSave, submitting,
}: {
  open: boolean
  onClose: () => void
  user: UserRow | null
  roles: RoleEntity[]
  onSave: (payload: Partial<UserRow> & { role: { id: number } }) => void | Promise<void>
  submitting?: boolean
}) {
  if (!user) return null
  return (
    <Modal open={open} title="Edit User" onClose={onClose}>
      <UserForm
        initial={user}
        roles={roles}
        submitLabel="Save"
        onSubmit={onSave}
        onCancel={onClose}
        submitting={submitting}
      />
    </Modal>
  )
}