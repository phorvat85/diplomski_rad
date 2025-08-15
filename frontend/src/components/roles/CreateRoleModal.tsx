import Modal from '../ui/Modal'
import RoleForm from './RoleForm'
import type { RoleEntity } from '../../types/entities'

export default function CreateRoleModal({
  open, onClose, onCreate, submitting,
}: {
  open: boolean
  onClose: () => void
  onCreate: (payload: Partial<RoleEntity>) => void | Promise<void>
  submitting?: boolean
}) {
  return (
    <Modal open={open} title="Create Role" onClose={onClose}>
      <RoleForm submitLabel="Create" onSubmit={onCreate} onCancel={onClose} submitting={submitting} />
    </Modal>
  )
}