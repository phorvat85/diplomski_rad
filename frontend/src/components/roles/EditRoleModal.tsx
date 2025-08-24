import { useState } from 'react'
import Modal from '../ui/Modal'
import RoleForm from './RoleForm'
import type { RoleEntity } from '../../types/entities'

export default function EditRoleModal({
  open,
  onClose,
  role,
  onSave,
  submitting,
}: {
  open: boolean
  onClose: () => void
  role: RoleEntity | null
  onSave: (payload: Partial<RoleEntity>) => void | Promise<void>
  submitting?: boolean
}) {
  const [saving, setSaving] = useState(false)

  if (!role) return null

  const handleSubmit = async (payload: Partial<RoleEntity>) => {
    if (saving) return
    try {
      setSaving(true)
      await Promise.resolve(onSave(payload)) // support sync or async onSave
      onClose() // close only on success
    } catch (e) {
      // keep modal open so user can fix errors; optionally show error inside RoleForm
      // eslint-disable-next-line no-console
      console.error('Failed to save role', e)
    } finally {
      setSaving(false)
    }
  }

  const busy = Boolean(submitting || saving)

  return (
    <Modal open={open} title="Edit Role" onClose={onClose}>
      <RoleForm
        initial={role}
        submitLabel={busy ? 'Saving…' : 'Save'}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitting={busy}
      />
    </Modal>
  )
}