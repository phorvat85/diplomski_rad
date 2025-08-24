import { api } from './client'

export type User = {
  id: number | string
  username: string
  email?: string
  role: string | { id: number | string; name: string }

  enabled: boolean
  accountNonExpired: boolean
  credentialsNonExpired: boolean
  accountNonLocked: boolean
  failedLoginAttempts?: number
}

export async function listUsers() {
  const { data } = await api.get<User[] | { items?: User[] }>('/worker/user/users')
  return Array.isArray(data) ? (data as User[]) : ((data.items ?? []) as User[])
}

export async function createUser(payload: Partial<User>) {
  const { data } = await api.post<User>('/admin/user/create', payload)
  return data
}

export async function updateUser(payload: Partial<User>) {
  const { data } = await api.put<User>('/admin/user/update', payload)
  return data
}

export async function deleteUser(id: number | string) {
  await api.delete(`/admin/user/delete/${id}`)
}