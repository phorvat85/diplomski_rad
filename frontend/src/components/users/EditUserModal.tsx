import { useState } from 'react'
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
  const [saving, setSaving] = useState(false)

  if (!user) return null

  const handleSubmit = async (payload: Partial<UserRow> & { role: { id: number } }) => {
    if (saving) return
    try {
      setSaving(true)
      await Promise.resolve(onSave(payload))
      onClose()
    } catch (e) {
      console.error('Failed to save user', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title="Edit User" onClose={onClose}>
      <UserForm
        initial={user}
        roles={roles}
        submitLabel={saving || submitting ? 'Saving…' : 'Save'}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitting={Boolean(submitting || saving)}
      />
    </Modal>
  )
}