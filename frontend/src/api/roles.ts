import { api } from './client'
import type { RoleEntity } from '../types/entities'

// Adjust endpoints if your backend differs
export async function listRoles(): Promise<RoleEntity[]> {
  const { data } = await api.get<RoleEntity[]>('/admin/role/roles')
  return data
}

export async function createRole(payload: { name: string }): Promise<RoleEntity> {
  const { data } = await api.post<RoleEntity>('/admin/role/create', payload)
  return data
}

export async function updateRole(payload: { id: number | string; name: string }): Promise<RoleEntity> {
  const { data } = await api.put<RoleEntity>('/admin/role/update', payload)
  return data
}

export async function deleteRole(id: number | string): Promise<void> {
  await api.delete(`/admin/role/delete/${id}`)
}