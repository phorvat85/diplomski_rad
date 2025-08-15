import Modal from '../ui/Modal'
import UserForm from './UserForm'
import { RoleEntity, UserRow } from '../../types/entities'

export default function CreateUserModal({
  open, onClose, roles, onCreate, submitting,
}: {
  open: boolean
  onClose: () => void
  roles: RoleEntity[]
  onCreate: (payload: Partial<UserRow> & { password?: string; role: { id: number } }) => void | Promise<void>
  submitting?: boolean
}) {
  return (
    <Modal open={open} title="Create User" onClose={onClose}>
      <UserForm
        roles={roles}
        includePassword
        submitLabel="Create"
        onSubmit={onCreate}
        onCancel={onClose}
        submitting={submitting}
      />
    </Modal>
  )
}