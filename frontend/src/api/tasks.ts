
import { api } from './client'

export type Task = {
  id: number | string
  taskKey: string
  title: string
  description?: string
  estimation?: string
  assignee?: { id: number | string; username: string }
}

export async function listTasks() {
  const { data } = await api.get('/admin/task/tasks')
  return Array.isArray(data) ? data as Task[] : (data.items ?? []) as Task[]
}
export async function createTask(payload: Partial<Task>) {
  const { data } = await api.post('/admin/task/create', payload)
  return data as Task
}
export async function updateTask(payload: Partial<Task>) {
  const { data } = await api.put('/admin/task/update', payload)
  return data as Task
}
export async function deleteTask(id: number | string) {
  await api.delete(`/admin/task/delete/${id}`)
}
