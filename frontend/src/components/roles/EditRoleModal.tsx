import Modal from '../ui/Modal'
import RoleForm from './RoleForm'
import type { RoleEntity } from '../../types/entities'

export default function EditRoleModal({
  open, onClose, role, onSave, submitting,
}: {
  open: boolean
  onClose: () => void
  role: RoleEntity | null
  onSave: (payload: Partial<RoleEntity>) => void | Promise<void>
  submitting?: boolean
}) {
  if (!role) return null
  return (
    <Modal open={open} title="Edit Role" onClose={onClose}>
      <RoleForm initial={role} submitLabel="Save" onSubmit={onSave} onCancel={onClose} submitting={submitting} />
    </Modal>
  )
}